import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController';
import { authenticate, authorize } from '../middlewares/auth';

export const auditLogRoutes = Router();

auditLogRoutes.use(authenticate);
auditLogRoutes.use(authorize('technician', 'professor'));

auditLogRoutes.get('/', auditLogController.findAll);

