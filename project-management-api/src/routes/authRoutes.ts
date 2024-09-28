import express from 'express';
import { registerUser, validateRegistration, loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);

export default router;
