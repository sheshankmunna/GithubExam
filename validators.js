import { body } from 'express-validator';

export const loginValidation = [
  body('username').isString().trim().notEmpty().withMessage('Username required'),
  body('password').isString().notEmpty().withMessage('Password required')
];
