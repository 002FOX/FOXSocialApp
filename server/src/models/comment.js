import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userPicture:{
            type: String,
            required: true,
            default: "",
        },
        picture: {
            type: String,
            default: '',
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

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;