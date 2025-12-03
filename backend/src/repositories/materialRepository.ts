import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface MaterialFilters {
  materialType?: string;
  conditionStatus?: string;
  thematicArea?: string;
  search?: string;
  availableOnly?: boolean;
}

export const materialRepository = {
  async findAll(filters: MaterialFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.materialType) {
      where.materialType = filters.materialType;
    }

    if (filters.conditionStatus) {
      where.conditionStatus = filters.conditionStatus;
    }

    if (filters.thematicArea) {
      where.thematicArea = { contains: filters.thematicArea };
    }

    if (filters.availableOnly) {
      where.quantityAvailable = { gt: 0 };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { internalCode: { contains: filters.search } },
        { thematicArea: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.material.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    return prisma.material.findUnique({
      where: { id },
      include: {
        loans: {
          where: { status: 'active' },
          include: { user: true },
        },
        reservations: {
          include: { user: true },
          orderBy: { priorityLevel: 'desc' },
        },
      },
    });
  },

  async findByInternalCode(internalCode: string) {
    return prisma.material.findUnique({
      where: { internalCode },
    });
  },

  async create(data: {
    internalCode: string;
    title: string;
    thematicArea: string;
    materialType: string;
    quantityTotal: number;
    quantityAvailable: number;
    conditionStatus: string;
  }) {
    return prisma.material.create({
      data,
    });
  },

  async update(id: number, data: Partial<{
    title: string;
    thematicArea: string;
    materialType: string;
    quantityTotal: number;
    quantityAvailable: number;
    conditionStatus: string;
  }>) {
    return prisma.material.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.material.delete({
      where: { id },
    });
  },

  async decrementQuantity(id: number, amount: number = 1) {
    return prisma.material.update({
      where: { id },
      data: {
        quantityAvailable: {
          decrement: amount,
        },
      },
    });
  },

  async incrementQuantity(id: number, amount: number = 1) {
    return prisma.material.update({
      where: { id },
      data: {
        quantityAvailable: {
          increment: amount,
        },
      },
    });
  },
};

