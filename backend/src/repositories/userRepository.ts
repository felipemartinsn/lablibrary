import prisma from '../config/database';
import { PaginationParams, getSkip } from '../utils/pagination';

export interface UserFilters {
  userType?: string;
  active?: boolean;
  blocked?: boolean;
  search?: string;
}

export const userRepository = {
  async findAll(filters: UserFilters, pagination: PaginationParams) {
    const { page, limit, sortBy, sortOrder } = pagination;
    const skip = getSkip(page, limit);

    const where: any = {};

    if (filters.userType) {
      where.userType = filters.userType;
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.blocked) {
      where.blockedUntil = {
        gt: new Date(),
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
        { registrationNumber: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          registrationNumber: true,
          userType: true,
          labLink: true,
          fineCount: true,
          active: true,
          blockedUntil: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        loans: {
          where: { status: 'active' },
          include: { material: true },
        },
        fines: {
          where: { isActive: true },
        },
        reservations: {
          include: { material: true },
        },
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findByRegistrationNumber(registrationNumber: string) {
    return prisma.user.findUnique({
      where: { registrationNumber },
    });
  },

  async create(data: {
    name: string;
    email: string;
    registrationNumber: string;
    userType: string;
    labLink?: string;
    password: string;
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        registrationNumber: true,
        userType: true,
        labLink: true,
        fineCount: true,
        active: true,
        blockedUntil: true,
        createdAt: true,
        updatedAt: true,
      },
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
    fineCount: number;
  }>) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        registrationNumber: true,
        userType: true,
        labLink: true,
        fineCount: true,
        active: true,
        blockedUntil: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async incrementFineCount(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        fineCount: {
          increment: 1,
        },
      },
    });
  },

  async blockUser(id: number, blockedUntil: Date) {
    return prisma.user.update({
      where: { id },
      data: { blockedUntil },
    });
  },
};

