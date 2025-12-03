import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { validate } from '../middlewares/validate';
import { createLoanSchema, returnLoanSchema } from '../validators/loanValidator';
import { auditLog } from '../middlewares/auditLog';

export const loanRoutes = Router();

loanRoutes.get('/', loanController.findAll);
loanRoutes.get('/:id', loanController.findById);

loanRoutes.post(
  '/',
  validate(createLoanSchema),
  auditLog('Loan', 'INSERT'),
  loanController.create
);

loanRoutes.post(
  '/:id/return',
  validate(returnLoanSchema),
  auditLog('Loan', 'UPDATE'),
  loanController.returnLoan
);

loanRoutes.post(
  '/process-overdue',
  loanController.processOverdueLoans
);

