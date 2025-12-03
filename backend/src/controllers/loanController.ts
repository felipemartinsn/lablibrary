import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { loanService } from '../services/loanService';

export const loanController = {
  async findAll(req: AuthRequest, res: Response) {
    const result = await loanService.findAll(req.query);
    res.json({ success: true, ...result });
  },

  async findById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const loan = await loanService.findById(id);
    res.json({ success: true, data: loan });
  },

  async create(req: AuthRequest, res: Response) {
    const dueDate = new Date(req.body.dueDate);
    const loan = await loanService.create({
      ...req.body,
      responsibleStaffId: req.user!.id,
      dueDate,
    });
    res.status(201).json({ success: true, data: loan });
  },

  async returnLoan(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const loan = await loanService.returnLoan(id, req.body.returnCondition);
    res.json({ success: true, data: loan });
  },

  async processOverdueLoans(req: AuthRequest, res: Response) {
    const loans = await loanService.processOverdueLoans();
    res.json({ success: true, data: loans });
  },
};

