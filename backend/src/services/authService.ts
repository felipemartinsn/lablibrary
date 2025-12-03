import bcrypt from 'bcryptjs';
import { AppError } from '../middlewares/errorHandler';
import { userRepository } from '../repositories/userRepository';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const authService = {
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios', 400);
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    if (!user.active) {
      throw new AppError('Usuário inativo. Entre em contato com o administrador.', 403);
    }

    // Check if user is blocked
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      const blockedUntil = new Date(user.blockedUntil);
      throw new AppError(
        `Usuário bloqueado até ${blockedUntil.toLocaleDateString('pt-BR')}`,
        403
      );
    }

    if (!user.password) {
      throw new AppError('Erro interno: senha não configurada', 500);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      userType: user.userType,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      userType: user.userType,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        userType: user.userType,
        labLink: user.labLink,
        fineCount: user.fineCount,
        active: user.active,
        blockedUntil: user.blockedUntil,
      },
      token,
      refreshToken,
    };
  },

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await userRepository.findById(decoded.id);
      if (!user || !user.active) {
        throw new AppError('Usuário inválido', 401);
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType,
      });

      return { token };
    } catch (error) {
      throw new AppError('Token inválido', 401);
    }
  },
};

