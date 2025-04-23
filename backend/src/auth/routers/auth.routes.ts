import { Router } from 'express';
import { signUpController } from '../controllers/sign-up';
import { signInController } from '../controllers/sign-in';


const router = Router();

router.post('/signIn', signInController);
router.post('/signUp', signUpController);

export default router;
