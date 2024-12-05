"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuthController_1 = require("../userControllers/userAuthController");
const Validator_1 = require("../../middlewares/Validator");
const router = (0, express_1.Router)();
// User Auth Routes
router.post('/register', userAuthController_1.registerUser, Validator_1.Validators.registerValidationRules);
router.post('/verify-email', userAuthController_1.verifyUserEmail);
exports.default = router;
