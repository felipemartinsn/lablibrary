import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { settingService } from '../services/settingService';

export const settingController = {
  async get(req: AuthRequest, res: Response) {
    const settings = await settingService.get();
    res.json({ success: true, data: settings });
  },

  async update(req: AuthRequest, res: Response) {
    const settings = await settingService.update(req.body);
    res.json({ success: true, data: settings });
  },
};

