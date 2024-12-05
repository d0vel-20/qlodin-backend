import { body } from 'express-validator';

const registerValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('userName').notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const Validators = {
  registerValidationRules
}