import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { loginSchema, refreshTokenSchema } from '../validators/authValidator';

export const authRoutes = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
authRoutes.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 */
authRoutes.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

