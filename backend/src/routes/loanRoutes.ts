import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createLoanSchema, returnLoanSchema } from '../validators/loanValidator';
import { auditLog } from '../middlewares/auditLog';

export const loanRoutes = Router();

loanRoutes.use(authenticate);

loanRoutes.get('/', loanController.findAll);
loanRoutes.get('/:id', loanController.findById);

loanRoutes.post(
  '/',
  authorize('technician', 'professor'),
  validate(createLoanSchema),
  auditLog('Loan', 'INSERT'),
  loanController.create
);

loanRoutes.post(
  '/:id/return',
  authorize('technician', 'professor'),
  validate(returnLoanSchema),
  auditLog('Loan', 'UPDATE'),
  loanController.returnLoan
);

loanRoutes.post(
  '/process-overdue',
  authorize('technician'),
  loanController.processOverdueLoans
);

