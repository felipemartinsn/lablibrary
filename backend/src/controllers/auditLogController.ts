import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { auditLogService } from '../services/auditLogService';
import { PaginationParams, getPaginationParams, getTotalPages } from '../utils/pagination';

export const auditLogController = {
  async findAll(req: AuthRequest, res: Response) {
    const filters = {
      userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      entity: req.query.entity as string,
      actionType: req.query.actionType as string,
    };

    const pagination = getPaginationParams(req.query);
    const result = await auditLogService.findAll(filters, pagination);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: getTotalPages(result.total, pagination.limit),
      },
    });
  },
};

