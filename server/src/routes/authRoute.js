import { Router } from 'express';
import { register } from '../controllers/authController.js'
import { login, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const authRouter = Router();

authRouter
.post('/register', register)
.post('/login', login)
.get('/logout', logout);

export default authRouter;