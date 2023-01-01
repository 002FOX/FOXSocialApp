import { Router } from 'express';
import { register } from '../controllers/authController.js'
import { login, logout } from '../controllers/authController.js';
import { verifyToken, refreshToken } from '../middleware/auth.js';

const authRouter = Router();

authRouter
.post('/register', register)
.post('/login', login)
.post('/refresh', refreshToken)
.delete('/logout', verifyToken, logout)


export default authRouter;