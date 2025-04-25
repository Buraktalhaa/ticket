import { Router } from 'express';
import { signUpController } from '../controllers/sign-up';
import { signInController } from '../controllers/sign-in';
import { refreshController } from '../controllers/refresh';


const router = Router();

router.post('/signIn', signInController);
router.post('/signUp', signUpController);
router.post('/refresh', refreshController)

export default router;
