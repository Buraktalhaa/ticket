import { Router } from 'express';
import { signUpController } from '../controllers/sign-up';
import { signInController } from '../controllers/sign-in';
import { refreshController } from '../controllers/refresh';
import { forgotPasswordController } from '../controllers/forgot-password';
import { resetPasswordController } from '../controllers/resetPassword';


const router = Router();

router.post('/signIn', signInController);
router.post('/signUp', signUpController);
router.post('/refresh', refreshController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', resetPasswordController)

export default router;
