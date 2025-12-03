import { Router } from 'express';
import { settingController } from '../controllers/settingController';
import { auditLog } from '../middlewares/auditLog';

export const settingRoutes = Router();

// Rotas públicas para demonstração
settingRoutes.get('/', settingController.get);

settingRoutes.put(
  '/',
  auditLog('Setting', 'UPDATE'),
  settingController.update
);

