import { Router } from "express";
import {
    addPost,
    likePost,
    removePost,
    showFriendsPosts,
    showUserPosts,
    getPost
} from '../controllers/postsController.js';
import { verifyToken } from '../middleware/auth.js';

const postRouter = Router();

postRouter
.get('/:postId', getPost)
.post('/new', verifyToken, addPost)
.patch('/:postId', verifyToken, likePost)
.delete('/:postId', verifyToken, removePost)
.get('/friends', verifyToken, showFriendsPosts)
.get('/:userId', showUserPosts)

export default postRouter;