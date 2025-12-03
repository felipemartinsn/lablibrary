import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  registrationNumber: z.string().min(1, 'Número de matrícula é obrigatório'),
  userType: z.enum(['student', 'professor', 'technician'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' }),
  }),
  labLink: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  registrationNumber: z.string().min(1).optional(),
  userType: z.enum(['student', 'professor', 'technician']).optional(),
  labLink: z.string().optional(),
  active: z.boolean().optional(),
  blockedUntil: z.string().datetime().nullable().optional(),
});

