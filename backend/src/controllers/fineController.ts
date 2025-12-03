import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { fineService } from '../services/fineService';

export const fineController = {
  async findAll(req: AuthRequest, res: Response) {
    const result = await fineService.findAll(req.query);
    res.json({ success: true, ...result });
  },

  async findById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const fine = await fineService.findById(id);
    res.json({ success: true, data: fine });
  },

  async create(req: AuthRequest, res: Response) {
    const fine = await fineService.create(req.body);
    res.status(201).json({ success: true, data: fine });
  },

  async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const fine = await fineService.update(id, req.body);
    res.json({ success: true, data: fine });
  },

  async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    await fineService.delete(id);
    res.json({ success: true, message: 'Advertência excluída com sucesso' });
  },

  async findByUser(req: AuthRequest, res: Response) {
    const userId = parseInt(req.params.userId);
    const fines = await fineService.findByUser(userId);
    res.json({ success: true, data: fines });
  },
};

