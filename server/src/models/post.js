import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userPicture:{
            type: String,
            default: "",
        },
        picture: {
            type: String,
            default: '',
        },
        comments: {
            type: [String],
            default: [],
        },
        likes: {
            type: Map,
            of: Boolean,
        }
    },
    {
        timestamps: true 
    }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;