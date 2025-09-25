import { Router } from 'express';
import { loginController, signupController } from '../controller/authController.js';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);

export default router;
