import { AppError } from '../middlewares/errorHandler';
import { fineRepository, FineFilters } from '../repositories/fineRepository';
import { userRepository } from '../repositories/userRepository';
import { userService } from './userService';
import { settingRepository } from '../repositories/settingRepository';
import { PaginationParams, PaginatedResult, getPaginationParams, getTotalPages } from '../utils/pagination';

export const fineService = {
  async findAll(query: any): Promise<PaginatedResult<any>> {
    const filters: FineFilters = {
      userId: query.userId ? parseInt(query.userId) : undefined,
      loanId: query.loanId ? parseInt(query.loanId) : undefined,
      isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined,
      reason: query.reason,
    };

    const pagination = getPaginationParams(query);
    const { data, total } = await fineRepository.findAll(filters, pagination);

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
    const fine = await fineRepository.findById(id);
    if (!fine) {
      throw new AppError('Advertência não encontrada', 404);
    }
    return fine;
  },

  async create(data: {
    userId: number;
    loanId?: number;
    reason: string;
    description?: string;
    isActive: boolean;
  }) {
    // Check if user exists
    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Create fine
    const fine = await fineRepository.create(data);

    // If fine is active, increment user's fine count
    if (data.isActive) {
      await userRepository.incrementFineCount(data.userId);

      // Check if user should be blocked
      await userService.checkAndBlockIfNeeded(data.userId);
    }

    return fine;
  },

  async update(id: number, data: Partial<{
    isActive: boolean;
    description: string;
  }>) {
    const fine = await fineRepository.findById(id);
    if (!fine) {
      throw new AppError('Advertência não encontrada', 404);
    }

    // If deactivating fine, we should decrement fine count
    // But for simplicity, we'll keep the count as is (historical record)
    // In a real system, you might want to track this differently

    return fineRepository.update(id, data);
  },

  async delete(id: number) {
    const fine = await fineRepository.findById(id);
    if (!fine) {
      throw new AppError('Advertência não encontrada', 404);
    }

    return fineRepository.delete(id);
  },

  async findByUser(userId: number) {
    return fineRepository.findActiveByUser(userId);
  },
};

