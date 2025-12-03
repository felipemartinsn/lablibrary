import { Router } from 'express';
import { materialController } from '../controllers/materialController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createMaterialSchema, updateMaterialSchema } from '../validators/materialValidator';
import { auditLog } from '../middlewares/auditLog';

export const materialRoutes = Router();

materialRoutes.use(authenticate);

materialRoutes.get('/', materialController.findAll);
materialRoutes.get('/:id', materialController.findById);

materialRoutes.post(
  '/',
  authorize('technician', 'professor'),
  validate(createMaterialSchema),
  auditLog('Material', 'INSERT'),
  materialController.create
);

materialRoutes.put(
  '/:id',
  authorize('technician', 'professor'),
  validate(updateMaterialSchema),
  auditLog('Material', 'UPDATE'),
  materialController.update
);

materialRoutes.delete(
  '/:id',
  authorize('technician'),
  auditLog('Material', 'DELETE'),
  materialController.delete
);

