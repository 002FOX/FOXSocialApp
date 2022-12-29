import { Router } from 'express';
import authRouter from './authRoute.js';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    res.status(200).send('Connected.')
})

apiRouter.get('/auth', authRouter);
apiRouter.get('/users', userRouter);

export default apiRouter;