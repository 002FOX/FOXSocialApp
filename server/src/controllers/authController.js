import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Token from '../models/token.js';

export const register = async (req, res) => {

    try{

        const { ign, email, password, picture, friends } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ ign, email, password: passwordHash, picture, friends });
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
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        const passwordConfirm = bcrypt.compare(password, user.password);

        if(!passwordConfirm){
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m'});
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET);

        new Token({ refreshToken: refreshToken }).save();
        delete user.password;
        res.cookie('accessToken', token, { httpOnly: true, maxAge: 900000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 900000 });
        res.status(200).json({ token, refreshToken, user });

    }catch(error){

        res.status(500).json({ error: error.message })
    }
}

export const logout = async (req, res) => {

    try{
        const token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if(!token || !refreshToken) return res.status(404).send('User not logged in');

        await Token.findOne({ refreshToken: refreshToken}).deleteOne();
        res.clearCookie('accessToken').clearCookie('refreshToken');
        res.status(200).send("Successfully logged out!");

    }catch(error){
        res.status(404).json({ error: error.message });
    }
}
