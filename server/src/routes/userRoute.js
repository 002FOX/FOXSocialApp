import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getUserController,
         getUserFriendsController,
         addFriendController,
         deleteFriendController
        } from '../controllers/usersController.js';

const userRouter = Router();

userRouter
.get('/:id', verifyToken, getUserController)
.get('/:id/friends', verifyToken, getUserFriendsController)
.patch('/:id/:friendId', verifyToken, addFriendController)
.delete('/:id/:friendId', verifyToken, deleteFriendController)

export default userRouter;