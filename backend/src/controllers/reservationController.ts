import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { reservationService } from '../services/reservationService';

export const reservationController = {
  async findAll(req: AuthRequest, res: Response) {
    const result = await reservationService.findAll(req.query);
    res.json({ success: true, ...result });
  },

  async findById(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const reservation = await reservationService.findById(id);
    res.json({ success: true, data: reservation });
  },

  async create(req: AuthRequest, res: Response) {
    const reservation = await reservationService.create(req.body);
    res.status(201).json({ success: true, data: reservation });
  },

  async cancel(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    await reservationService.cancel(id);
    res.json({ success: true, message: 'Reserva cancelada com sucesso' });
  },
};

