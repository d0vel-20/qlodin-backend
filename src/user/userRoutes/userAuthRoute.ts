import {Router} from 'express';
import {
    registerUser,
    verifyUserEmail,
    loginUser,
    forgotPassword,
    resendResetCode,
    resetPassword

} from '../userControllers/userAuthController';

import { verifyUserToken, verifyAdminToken } from '../../middlewares/authMidleware';
import { Validators } from '../../middlewares/Validator';

const router = Router();
// User Auth Routes
router.post('/register', registerUser, Validators.registerValidationRules);
router.post('/verify-email', verifyUserEmail );
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/resend-reset-code', resendResetCode);
router.post('/reset-password', resetPassword);


export default router;