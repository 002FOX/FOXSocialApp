import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {

    try{

        const { ign, email, password, picture, friends } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ ign, email, password: passwordHash, picture, friends })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    }catch(error){

        res.status(500).json({ error: error.message });

    }

}

export const login = async (req, res) => {

    try{
        
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if(!user) {
            res.status(400).json({ msg: 'User does not exist' });
        }

        const passwordConfirm = bcrypt.compare(password, user.password);

        if(!passwordConfirm){
            res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    }catch(error){

        res.status(500).json({ error: error.message })
    }
}