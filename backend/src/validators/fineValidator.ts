import { z } from 'zod';

export const createFineSchema = z.object({
  userId: z.number().int().positive('ID do usuário inválido'),
  loanId: z.number().int().positive().optional(),
  reason: z.enum(['late_return', 'damaged_material', 'rule_violation'], {
    errorMap: () => ({ message: 'Motivo inválido' }),
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateFineSchema = z.object({
  isActive: z.boolean().optional(),
  description: z.string().optional(),
});

