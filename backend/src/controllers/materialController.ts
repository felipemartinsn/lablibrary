import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { materialService } from '../services/materialService';

export const materialController = {
  async findAll(req: AuthRequest, res: Response) {
    const result = await materialService.findAll(req.query);
    res.json({ success: true, ...result });
  },

  async findById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const material = await materialService.findById(id);
    res.json({ success: true, data: material });
  },

  async create(req: AuthRequest, res: Response) {
    const material = await materialService.create(req.body);
    res.status(201).json({ success: true, data: material });
  },

  async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const material = await materialService.update(id, req.body);
    res.json({ success: true, data: material });
  },

  async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    await materialService.delete(id);
    res.json({ success: true, message: 'Material excluído com sucesso' });
  },
};

