import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';
import { auditLog } from '../middlewares/auditLog';

export const userRoutes = Router();

userRoutes.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRoutes.get('/', userController.findAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
userRoutes.get('/:id', userController.findById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRoutes.post(
  '/',
  authorize('technician', 'professor'),
  validate(createUserSchema),
  auditLog('User', 'INSERT'),
  userController.create
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRoutes.put(
  '/:id',
  authorize('technician', 'professor'),
  validate(updateUserSchema),
  auditLog('User', 'UPDATE'),
  userController.update
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
userRoutes.delete(
  '/:id',
  authorize('technician'),
  auditLog('User', 'DELETE'),
  userController.delete
);

