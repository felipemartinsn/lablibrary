import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  userType: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET não configurado');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET não configurado');
  }

  return jwt.verify(token, secret) as TokenPayload;
};

