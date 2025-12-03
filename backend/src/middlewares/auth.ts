import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401);
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      userType: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Token inválido', 401));
    }
    next(error);
  }
};

export const authorize = (...allowedTypes: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Não autenticado', 401));
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return next(new AppError('Acesso negado', 403));
    }

    next();
  };
};

