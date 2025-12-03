import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { auditLogService } from '../services/auditLogService';

export const auditLog = (entity: string, actionType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      // Log after response
      setImmediate(async () => {
        try {
          await auditLogService.create({
            userId: req.user?.id,
            entity,
            actionType,
            details: JSON.stringify({
              method: req.method,
              path: req.path,
              body: req.body,
              params: req.params,
              query: req.query,
              response: body,
            }),
          });
        } catch (error) {
          console.error('Erro ao criar log de auditoria:', error);
        }
      });

      return originalJson.call(this, body);
    };

    next();
  };
};

