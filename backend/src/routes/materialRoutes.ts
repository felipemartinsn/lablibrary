import { Router } from 'express';
import { materialController } from '../controllers/materialController';
import { validate } from '../middlewares/validate';
import { createMaterialSchema, updateMaterialSchema } from '../validators/materialValidator';
import { auditLog } from '../middlewares/auditLog';

export const materialRoutes = Router();

materialRoutes.get('/', materialController.findAll);
materialRoutes.get('/:id', materialController.findById);

materialRoutes.post(
  '/',
  validate(createMaterialSchema),
  auditLog('Material', 'INSERT'),
  materialController.create
);

materialRoutes.put(
  '/:id',
  validate(updateMaterialSchema),
  auditLog('Material', 'UPDATE'),
  materialController.update
);

materialRoutes.delete(
  '/:id',
  auditLog('Material', 'DELETE'),
  materialController.delete
);

