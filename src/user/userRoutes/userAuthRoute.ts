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


export default router;