import { AppError } from '../middlewares/errorHandler';
import { settingRepository } from '../repositories/settingRepository';

export const settingService = {
  async get() {
    return settingRepository.findFirst();
  },

  async update(data: {
    maxFinesLimit?: number;
    blockDurationDays?: number;
  }) {
    if (data.maxFinesLimit !== undefined && data.maxFinesLimit < 1) {
      throw new AppError('Limite de advertências deve ser maior que 0', 400);
    }

    if (data.blockDurationDays !== undefined && data.blockDurationDays < 1) {
      throw new AppError('Duração do bloqueio deve ser maior que 0', 400);
    }

    return settingRepository.update(data);
  },
};

