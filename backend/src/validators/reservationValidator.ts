import { z } from 'zod';

export const createReservationSchema = z.object({
  materialId: z.number().int().positive('ID do material inválido'),
  userId: z.number().int().positive('ID do usuário inválido'),
  priorityLevel: z.number().int().nonnegative().optional(),
});

