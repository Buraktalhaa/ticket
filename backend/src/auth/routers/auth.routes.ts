import { Router } from 'express';
import { signUpController } from '../controllers/sign-up';
import { signInController } from '../controllers/sign-in';
import { forgotPasswordController } from '../controllers/forgot-password';
import { resetPasswordController } from '../controllers/reset-password';
import passport from 'passport';
import { googleCallback } from '../controllers/google-callback';
import '../controllers/google-strategy';
import { refreshController } from '../controllers/refresh-token';


const router = Router();

router.post('/sign-in', signInController);
router.post('/sign-up', signUpController);

router.post('/refresh', refreshController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', resetPasswordController)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback)

export default router;