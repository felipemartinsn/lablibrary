import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { userService } from '../services/userService';

export const userController = {
  async findAll(req: AuthRequest, res: Response) {
    const result = await userService.findAll(req.query);
    res.json({ success: true, ...result });
  },

  async findById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const user = await userService.findById(id);
    res.json({ success: true, data: user });
  },

  async create(req: AuthRequest, res: Response) {
    const user = await userService.create(req.body);
    res.status(201).json({ success: true, data: user });
  },

  async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const user = await userService.update(id, req.body);
    res.json({ success: true, data: user });
  },

  async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    await userService.delete(id);
    res.json({ success: true, message: 'Usuário excluído com sucesso' });
  },
};

