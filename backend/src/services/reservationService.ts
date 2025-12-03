import { AppError } from '../middlewares/errorHandler';
import { reservationRepository, ReservationFilters } from '../repositories/reservationRepository';
import { materialRepository } from '../repositories/materialRepository';
import { userRepository } from '../repositories/userRepository';
import { loanService } from './loanService';
import { PaginationParams, PaginatedResult, getPaginationParams, getTotalPages } from '../utils/pagination';

export const reservationService = {
  async findAll(query: any): Promise<PaginatedResult<any>> {
    const filters: ReservationFilters = {
      userId: query.userId ? parseInt(query.userId) : undefined,
      materialId: query.materialId ? parseInt(query.materialId) : undefined,
    };

    const pagination = getPaginationParams(query);
    const { data, total } = await reservationRepository.findAll(filters, pagination);

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
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new AppError('Reserva não encontrada', 404);
    }
    return reservation;
  },

  async create(data: {
    materialId: number;
    userId: number;
    priorityLevel?: number;
  }) {
    // Check if user exists
    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Check if material exists
    const material = await materialRepository.findById(data.materialId);
    if (!material) {
      throw new AppError('Material não encontrado', 404);
    }

    // Only allow reservation if material is not available
    if (material.quantityAvailable > 0) {
      throw new AppError('Material disponível. Não é necessário reservar', 400);
    }

    // Check if user already has a reservation for this material
    const existing = await reservationRepository.findByMaterialAndUser(
      data.materialId,
      data.userId
    );
    if (existing) {
      throw new AppError('Usuário já possui reserva para este material', 400);
    }

    // Determine priority level (default: 0, professors might have higher priority)
    const priorityLevel = data.priorityLevel ?? (user.userType === 'professor' ? 1 : 0);

    return reservationRepository.create({
      ...data,
      priorityLevel,
    });
  },

  async cancel(id: number) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new AppError('Reserva não encontrada', 404);
    }

    return reservationRepository.delete(id);
  },

  async cancelByMaterialAndUser(materialId: number, userId: number) {
    return reservationRepository.deleteByMaterialAndUser(materialId, userId);
  },

  async processNextReservation(materialId: number) {
    const material = await materialRepository.findById(materialId);
    if (!material) {
      return;
    }

    // Only process if material is now available
    if (material.quantityAvailable <= 0) {
      return;
    }

    // Get next reservation in queue
    const nextReservation = await reservationRepository.findNextInQueue(materialId);
    if (!nextReservation) {
      return;
    }

    // Auto-create loan for the first person in queue
    // This is a simplified approach - in production you might want to notify the user first
    try {
      // For now, we'll just delete the reservation
      // In a real system, you might want to notify the user and let them confirm
      await reservationRepository.delete(nextReservation.id);
      
      // Optionally, you could auto-create the loan here:
      // await loanService.create({
      //   userId: nextReservation.userId,
      //   materialId: materialId,
      //   responsibleStaffId: 1, // System or admin
      //   dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      // });
    } catch (error) {
      console.error('Error processing next reservation:', error);
    }
  },
};

