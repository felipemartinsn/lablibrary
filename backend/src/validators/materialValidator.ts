import { z } from 'zod';

export const createMaterialSchema = z.object({
  internalCode: z.string().min(1, 'Código interno é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  thematicArea: z.string().min(1, 'Área temática é obrigatória'),
  materialType: z.enum(['book', 'handout', 'article', 'equipment'], {
    errorMap: () => ({ message: 'Tipo de material inválido' }),
  }),
  quantityTotal: z.number().int().positive('Quantidade total deve ser positiva'),
  quantityAvailable: z.number().int().nonnegative('Quantidade disponível não pode ser negativa'),
  conditionStatus: z.enum(['new', 'good', 'damaged', 'maintenance', 'lost'], {
    errorMap: () => ({ message: 'Status de condição inválido' }),
  }),
});

export const updateMaterialSchema = z.object({
  title: z.string().min(1).optional(),
  thematicArea: z.string().min(1).optional(),
  materialType: z.enum(['book', 'handout', 'article', 'equipment']).optional(),
  quantityTotal: z.number().int().positive().optional(),
  quantityAvailable: z.number().int().nonnegative().optional(),
  conditionStatus: z.enum(['new', 'good', 'damaged', 'maintenance', 'lost']).optional(),
});

