import { Router } from 'express';
import authRouter from './authRoute.js';
import userRouter from './userRoute.js';
import postRouter from './postRouter.js';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    res.status(200).send('Connected.')
})

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);

export default apiRouter;