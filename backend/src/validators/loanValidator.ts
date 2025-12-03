import { z } from 'zod';

export const createLoanSchema = z.object({
  userId: z.number().int().positive('ID do usuário inválido'),
  materialId: z.number().int().positive('ID do material inválido'),
  dueDate: z.string().datetime('Data de vencimento inválida'),
});

export const returnLoanSchema = z.object({
  returnCondition: z.string().optional(),
});

