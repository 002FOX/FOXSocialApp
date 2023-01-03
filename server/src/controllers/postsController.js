import Post from "../models/post.js";
import User from "../models/user.js";

export const addPost = async (req, res) => {

    try{

        const { description, userId, userPicture, picture } = req.body;
        const newPost = await Post.create({ userId: userId, description: description, userPicture: userPicture, picture: picture, likes: {}, comments: [] });
        res.status(200).json(newPost);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const getPost = async (req, res) => {

    try{

        const { postId } = req.params;
        const post = await Post.findById({ _id: postId });
        res.status(200).json(post);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}
export const removePost = async (req, res) => {

    try{
        
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Post.findById({ _id: postId });

        if(post.userId == userId ){
            await post.deleteOne();
            await Post.save();
        }else{
            return res.status(403).send("You are not allowed to delete this post!");
        }
        
        res.status(200).send("Deleted!");

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const showUserPosts = async (req, res) => {

    try{
        
        const { userId } = req.params;
        const myPosts = Post.find({ userId: userId });
        res.status(200).json(myPosts);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const showFriendsPosts = async (req, res) => {

    try{
        
        const { userId } = req.body;
        const user = await User.findById({ _id: userId });
        const friends = user.friends;
        const friendsPosts = Post.find({ userId: { $in : friends } }).sort({ "createdAt": 1 });
        res.status(200).json(friendsPosts);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const likePost = async (req, res) => {

    try{
        
        const { userId } = req.body;
        const { postId } = req.params;
        const user = await User.findById({ _id: userId });
        const post = await Post.findById({ _id: postId });
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, 
            { likes: post.likes }, {new: true});
        res.status(200).json(updatedPost);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}