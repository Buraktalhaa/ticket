import { Router } from 'express';
import { signUpController } from '../controllers/sign-up';
import { signInController } from '../controllers/sign-in';
import { refreshController } from '../controllers/refresh';
import { forgotPasswordController } from '../controllers/forgot-password';
import { resetPasswordController } from '../controllers/resetPassword';
import passport from 'passport';
import { googleCallback } from '../controllers/googleCallback';
import '../auth/googleStrategy';


const router = Router();

router.post('/signIn', signInController);
router.post('/signUp', signUpController);

router.post('/refresh', refreshController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', resetPasswordController)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback)

export default router;