import { Router } from 'express';
import { fineController } from '../controllers/fineController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createFineSchema, updateFineSchema } from '../validators/fineValidator';
import { auditLog } from '../middlewares/auditLog';

export const fineRoutes = Router();

fineRoutes.use(authenticate);

fineRoutes.get('/', fineController.findAll);
fineRoutes.get('/:id', fineController.findById);
fineRoutes.get('/user/:userId', fineController.findByUser);

fineRoutes.post(
  '/',
  authorize('technician', 'professor'),
  validate(createFineSchema),
  auditLog('Fine', 'INSERT'),
  fineController.create
);

fineRoutes.put(
  '/:id',
  authorize('technician', 'professor'),
  validate(updateFineSchema),
  auditLog('Fine', 'UPDATE'),
  fineController.update
);

fineRoutes.delete(
  '/:id',
  authorize('technician'),
  auditLog('Fine', 'DELETE'),
  fineController.delete
);

