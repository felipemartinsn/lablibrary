import { AppError } from '../middlewares/errorHandler';
import { loanRepository, LoanFilters } from '../repositories/loanRepository';
import { materialRepository } from '../repositories/materialRepository';
import { userRepository } from '../repositories/userRepository';
import { userService } from './userService';
import { fineService } from './fineService';
import { reservationService } from './reservationService';
import { PaginationParams, PaginatedResult, getPaginationParams, getTotalPages } from '../utils/pagination';

export const loanService = {
  async findAll(query: any): Promise<PaginatedResult<any>> {
    const filters: LoanFilters = {
      userId: query.userId ? parseInt(query.userId) : undefined,
      materialId: query.materialId ? parseInt(query.materialId) : undefined,
      status: query.status,
      overdue: query.overdue === 'true',
    };

    const pagination = getPaginationParams(query);
    const { data, total } = await loanRepository.findAll(filters, pagination);

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: getTotalPages(total, pagination.limit),
      },
    };
  },

  async findById(id: number) {
    const loan = await loanRepository.findById(id);
    if (!loan) {
      throw new AppError('Empréstimo não encontrado', 404);
    }
    return loan;
  },

  async create(data: {
    userId: number;
    materialId: number;
    responsibleStaffId: number;
    dueDate: Date;
  }) {
    // Check if user exists and is active
    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    if (!user.active) {
      throw new AppError('Usuário inativo', 400);
    }

    // Check if user is blocked
    const isBlocked = await userService.checkBlocked(data.userId);
    if (isBlocked) {
      throw new AppError('Usuário bloqueado não pode fazer empréstimos', 403);
    }

    // Check if material exists and is available
    const material = await materialRepository.findById(data.materialId);
    if (!material) {
      throw new AppError('Material não encontrado', 404);
    }

    if (material.quantityAvailable <= 0) {
      throw new AppError('Material não disponível', 400);
    }

    // Check if user already has this material on loan
    const existingLoan = await loanRepository.findActiveByUserAndMaterial(
      data.userId,
      data.materialId
    );
    if (existingLoan) {
      throw new AppError('Usuário já possui este material emprestado', 400);
    }

    // Decrement material quantity
    await materialRepository.decrementQuantity(data.materialId);

    // Create loan
    const loan = await loanRepository.create({
      ...data,
      loanDate: new Date(),
      status: 'active',
    });

    // Remove reservation if exists
    try {
      await reservationService.cancelByMaterialAndUser(data.materialId, data.userId);
    } catch (error) {
      // Ignore if reservation doesn't exist
    }

    return loan;
  },

  async returnLoan(id: number, returnCondition?: string) {
    const loan = await loanRepository.findById(id);
    if (!loan) {
      throw new AppError('Empréstimo não encontrado', 404);
    }

    if (loan.status !== 'active') {
      throw new AppError('Empréstimo já foi devolvido', 400);
    }

    const returnDate = new Date();
    const isOverdue = returnDate > loan.dueDate;

    // Update loan
    const updatedLoan = await loanRepository.update(id, {
      returnDate,
      status: 'returned',
      returnCondition,
    });

    // Increment material quantity
    await materialRepository.incrementQuantity(loan.materialId);

    // Create fine if overdue
    if (isOverdue) {
      await fineService.create({
        userId: loan.userId,
        loanId: loan.id,
        reason: 'late_return',
        description: `Devolução atrasada. Data de vencimento: ${loan.dueDate.toISOString()}`,
        isActive: true,
      });
    }

    // Check if there are reservations and process next in queue
    await reservationService.processNextReservation(loan.materialId);

    return updatedLoan;
  },

  async processOverdueLoans() {
    const overdueLoans = await loanRepository.findOverdueLoans();

    for (const loan of overdueLoans) {
      // Update status to overdue
      await loanRepository.update(loan.id, {
        status: 'overdue',
      });

      // Check if fine already exists for this loan
      const existingFines = await loanRepository.findById(loan.id);
      const hasActiveFine = existingFines?.fines?.some(fine => fine.isActive && fine.reason === 'late_return');

      if (!hasActiveFine) {
        // Create fine for overdue loan
        await fineService.create({
          userId: loan.userId,
          loanId: loan.id,
          reason: 'late_return',
          description: `Empréstimo atrasado. Data de vencimento: ${loan.dueDate.toISOString()}`,
          isActive: true,
        });
      }
    }

    return overdueLoans;
  },
};

