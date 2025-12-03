import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface LoanFilters {
  userId?: number;
  materialId?: number;
  status?: string;
  overdue?: boolean;
  search?: string;
}

export const loanRepository = {
  async findAll(filters: LoanFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.materialId) {
      where.materialId = filters.materialId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.overdue) {
      where.status = 'active';
      where.dueDate = {
        lt: new Date(),
      };
    }

    const [data, total] = await Promise.all([
      prisma.loan.findMany({
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
          material: true,
          responsibleStaff: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.loan.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    return prisma.loan.findUnique({
      where: { id },
      include: {
        user: true,
        material: true,
        responsibleStaff: true,
        fines: true,
      },
    });
  },

  async findActiveByUserAndMaterial(userId: number, materialId: number) {
    return prisma.loan.findFirst({
      where: {
        userId,
        materialId,
        status: 'active',
      },
    });
  },

  async create(data: {
    userId: number;
    materialId: number;
    responsibleStaffId: number;
    loanDate: Date;
    dueDate: Date;
    status: string;
  }) {
    return prisma.loan.create({
      data,
      include: {
        user: true,
        material: true,
        responsibleStaff: true,
      },
    });
  },

  async update(id: number, data: Partial<{
    returnDate: Date;
    status: string;
    returnCondition: string;
  }>) {
    return prisma.loan.update({
      where: { id },
      data,
      include: {
        user: true,
        material: true,
        responsibleStaff: true,
      },
    });
  },

  async findOverdueLoans() {
    return prisma.loan.findMany({
      where: {
        status: 'active',
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        user: true,
        material: true,
      },
    });
  },
};

