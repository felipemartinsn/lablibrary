import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface ReservationFilters {
  userId?: number;
  materialId?: number;
}

export const reservationRepository = {
  async findAll(filters: ReservationFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.materialId) {
      where.materialId = filters.materialId;
    }

    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
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
        },
      }),
      prisma.reservation.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        material: true,
      },
    });
  },

  async findByMaterialAndUser(materialId: number, userId: number) {
    return prisma.reservation.findFirst({
      where: {
        materialId,
        userId,
      },
    });
  },

  async findNextInQueue(materialId: number) {
    return prisma.reservation.findFirst({
      where: {
        materialId,
      },
      orderBy: [
        { priorityLevel: 'desc' },
        { createdAt: 'asc' },
      ],
      include: {
        user: true,
        material: true,
      },
    });
  },

  async create(data: {
    materialId: number;
    userId: number;
    priorityLevel: number;
  }) {
    return prisma.reservation.create({
      data,
      include: {
        user: true,
        material: true,
      },
    });
  },

  async delete(id: number) {
    return prisma.reservation.delete({
      where: { id },
    });
  },

  async deleteByMaterialAndUser(materialId: number, userId: number) {
    return prisma.reservation.deleteMany({
      where: {
        materialId,
        userId,
      },
    });
  },
};

