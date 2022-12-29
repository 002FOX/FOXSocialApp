import { Router } from 'express';
import multer from 'multer';
import { register } from '../controllers/authController.js'

const authRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + Date.now());
    }
})

const upload = multer({ storage }); 

authRouter
.post('/register', upload.single('profile_picture'), register)
.post('/login', login);

export default authRouter;