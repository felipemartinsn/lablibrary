import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface AuditLogFilters {
  userId?: number;
  entity?: string;
  actionType?: string;
}

export const auditLogService = {
  async findAll(filters: AuditLogFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.entity) {
      where.entity = filters.entity;
    }

    if (filters.actionType) {
      where.actionType = filters.actionType;
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
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
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, total };
  },

  async create(data: {
    userId?: number;
    entity: string;
    actionType: string;
    details: string;
  }) {
    return prisma.auditLog.create({
      data,
    });
  },
};

