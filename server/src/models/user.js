import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        ign: {
            type: String,
            required: true,
            min: 3,
            max: 30,
        },
        email: {
            type: String,
            required: true,
            min: 10,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        picture: {
            type: String,
            default: '',
        },
        friends: {
            type: Array,
            default: [],
        }
    },
    {
        timestamps: true 
    }
);

const User = mongoose.model("User", UserSchema);
export default User;