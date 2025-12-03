import bcrypt from 'bcryptjs';
import { AppError } from '../middlewares/errorHandler';
import { userRepository, UserFilters } from '../repositories/userRepository';
import { PaginationParams, PaginatedResult, getPaginationParams, getTotalPages } from '../utils/pagination';
import { settingRepository } from '../repositories/settingRepository';

export const userService = {
  async findAll(query: any): Promise<PaginatedResult<any>> {
    const filters: UserFilters = {
      userType: query.userType,
      active: query.active !== undefined ? query.active === 'true' : undefined,
      blocked: query.blocked === 'true',
      search: query.search,
    };

    const pagination = getPaginationParams(query);
    const { data, total } = await userRepository.findAll(filters, pagination);

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
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user;
  },

  async create(data: {
    name: string;
    email: string;
    registrationNumber: string;
    userType: string;
    labLink?: string;
    password: string;
  }) {
    // Check if email already exists
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    // Check if registration number already exists
    const existingReg = await userRepository.findByRegistrationNumber(data.registrationNumber);
    if (existingReg) {
      throw new AppError('Número de matrícula já cadastrado', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  async update(id: number, data: Partial<{
    name: string;
    email: string;
    registrationNumber: string;
    userType: string;
    labLink: string;
    active: boolean;
    blockedUntil: Date | null;
  }>) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Check email uniqueness if changing
    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) {
        throw new AppError('Email já cadastrado', 400);
      }
    }

    // Check registration number uniqueness if changing
    if (data.registrationNumber && data.registrationNumber !== user.registrationNumber) {
      const existing = await userRepository.findByRegistrationNumber(data.registrationNumber);
      if (existing) {
        throw new AppError('Número de matrícula já cadastrado', 400);
      }
    }

    return userRepository.update(id, data);
  },

  async delete(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return userRepository.delete(id);
  },

  async checkBlocked(userId: number): Promise<boolean> {
    const user = await userRepository.findById(userId);
    if (!user) {
      return false;
    }

    if (user.blockedUntil && user.blockedUntil > new Date()) {
      return true;
    }

    return false;
  },

  async checkAndBlockIfNeeded(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      return;
    }

    const settings = await settingRepository.findFirst();
    const activeFines = await userRepository.findById(userId);
    
    if (activeFines && activeFines.fineCount >= settings.maxFinesLimit) {
      const blockedUntil = new Date();
      blockedUntil.setDate(blockedUntil.getDate() + settings.blockDurationDays);
      await userRepository.blockUser(userId, blockedUntil);
    }
  },
};

