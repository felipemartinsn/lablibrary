import { Router } from 'express';
import { fineController } from '../controllers/fineController';
import { validate } from '../middlewares/validate';
import { createFineSchema, updateFineSchema } from '../validators/fineValidator';
import { auditLog } from '../middlewares/auditLog';

export const fineRoutes = Router();

fineRoutes.get('/', fineController.findAll);
fineRoutes.get('/:id', fineController.findById);
fineRoutes.get('/user/:userId', fineController.findByUser);

fineRoutes.post(
  '/',
  validate(createFineSchema),
  auditLog('Fine', 'INSERT'),
  fineController.create
);

fineRoutes.put(
  '/:id',
  validate(updateFineSchema),
  auditLog('Fine', 'UPDATE'),
  fineController.update
);

fineRoutes.delete(
  '/:id',
  auditLog('Fine', 'DELETE'),
  fineController.delete
);

