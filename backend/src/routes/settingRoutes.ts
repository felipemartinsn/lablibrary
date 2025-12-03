import { Router } from 'express';
import { settingController } from '../controllers/settingController';
import { authenticate, authorize } from '../middlewares/auth';
import { auditLog } from '../middlewares/auditLog';

export const settingRoutes = Router();

settingRoutes.use(authenticate);
settingRoutes.use(authorize('technician'));

settingRoutes.get('/', settingController.get);

settingRoutes.put(
  '/',
  auditLog('Setting', 'UPDATE'),
  settingController.update
);

