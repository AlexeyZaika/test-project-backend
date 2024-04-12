import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid mail format').notEmpty().isEmail(),
  body('password', 'Password must be at least 5 characters').notEmpty().isLength({ min: 5 }),
  body('name', 'The name must be at least 5 characters').notEmpty().isLength({ min: 5 }),
  body('role', 'Invalid role').isIn(['manager', 'brand', 'afiliat']),
  body('contact', 'Must provide a valid UA phone number').optional().isMobilePhone(['uk-UA']).isNumeric(),
  body('address', 'Invalid address').optional().isString(),
];

export const loginValidation = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
];
