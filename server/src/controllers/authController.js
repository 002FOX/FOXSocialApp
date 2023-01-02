import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {

    try{

        const { ign, email, password } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ ign, email, password: passwordHash });
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

        const passwordConfirm = await bcrypt.compare(password, user.password);

        if(!passwordConfirm){
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        if(req.cookies.refreshToken){
            user.refreshTokens = user.refreshTokens.filter(rt => rt !== req.cookies.refreshToken);
            await user.save();
            res.clearCookie('refreshToken').clearCookie('accessToken');
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '24h' });

        user.refreshTokens.push(refreshToken);
        await user.save();
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 });
        return res.status(200).json({ accessToken, refreshToken, user });

    }catch(error){

        res.status(500).json({ error: error.message })
    }
}

export const logout = async (req, res) => {

    try{

        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(204).send('User not logged in');

        const foundUser = await User.findOne({ refreshTokens: refreshToken })
        if(!foundUser){
            res.clearCookie('refreshToken').clearCookie('accessToken');
            return res.status(204)
        }

        foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt !== refreshToken);
        await foundUser.save();
        res.clearCookie('accessToken').clearCookie('refreshToken');
        res.status(200).send("Successfully logged out!");

    }catch(error){
        res.status(404).json({ error: error.message });
    }
}
