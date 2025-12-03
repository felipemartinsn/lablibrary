import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { materialRoutes } from './materialRoutes';
import { loanRoutes } from './loanRoutes';
import { fineRoutes } from './fineRoutes';
import { reservationRoutes } from './reservationRoutes';
import { settingRoutes } from './settingRoutes';
import { auditLogRoutes } from './auditLogRoutes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/materials', materialRoutes);
routes.use('/loans', loanRoutes);
routes.use('/fines', fineRoutes);
routes.use('/reservations', reservationRoutes);
routes.use('/settings', settingRoutes);
routes.use('/audit-logs', auditLogRoutes);

