import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController';

export const auditLogRoutes = Router();

// Rotas públicas para demonstração
auditLogRoutes.get('/', auditLogController.findAll);

