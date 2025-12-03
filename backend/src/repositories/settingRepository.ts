import prisma from '../config/database';

export const settingRepository = {
  async findFirst() {
    let setting = await prisma.setting.findFirst();

    if (!setting) {
      // Create default settings if none exist
      setting = await prisma.setting.create({
        data: {
          maxFinesLimit: 3,
          blockDurationDays: 7,
        },
      });
    }

    return setting;
  },

  async update(data: {
    maxFinesLimit?: number;
    blockDurationDays?: number;
  }) {
    const existing = await this.findFirst();

    return prisma.setting.update({
      where: { id: existing.id },
      data,
    });
  },
};

