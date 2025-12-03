import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface FineFilters {
  userId?: number;
  loanId?: number;
  isActive?: boolean;
  reason?: string;
}

export const fineRepository = {
  async findAll(filters: FineFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.loanId) {
      where.loanId = filters.loanId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.reason) {
      where.reason = filters.reason;
    }

    const [data, total] = await Promise.all([
      prisma.fine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              registrationNumber: true,
            },
          },
          loan: {
            include: {
              material: true,
            },
          },
        },
      }),
      prisma.fine.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    return prisma.fine.findUnique({
      where: { id },
      include: {
        user: true,
        loan: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async findActiveByUser(userId: number) {
    return prisma.fine.findMany({
      where: {
        userId,
        isActive: true,
      },
    });
  },

  async create(data: {
    userId: number;
    loanId?: number;
    reason: string;
    description?: string;
    isActive: boolean;
  }) {
    return prisma.fine.create({
      data,
      include: {
        user: true,
        loan: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async update(id: number, data: Partial<{
    isActive: boolean;
    description: string;
  }>) {
    return prisma.fine.update({
      where: { id },
      data,
      include: {
        user: true,
        loan: {
          include: {
            material: true,
          },
        },
      },
    });
  },

  async delete(id: number) {
    return prisma.fine.delete({
      where: { id },
    });
  },
};

