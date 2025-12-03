import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  },
};

