import { Router } from 'express';
import { reservationController } from '../controllers/reservationController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createReservationSchema } from '../validators/reservationValidator';
import { auditLog } from '../middlewares/auditLog';

export const reservationRoutes = Router();

reservationRoutes.use(authenticate);

reservationRoutes.get('/', reservationController.findAll);
reservationRoutes.get('/:id', reservationController.findById);

reservationRoutes.post(
  '/',
  validate(createReservationSchema),
  auditLog('Reservation', 'INSERT'),
  reservationController.create
);

reservationRoutes.delete(
  '/:id',
  auditLog('Reservation', 'DELETE'),
  reservationController.cancel
);

