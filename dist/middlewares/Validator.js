"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const express_validator_1 = require("express-validator");
const registerValidationRules = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('userName').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
];
exports.Validators = {
    registerValidationRules
};
