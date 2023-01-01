import jwt from 'jsonwebtoken';
import Token from '../models/token.js';
import User from '../models/user.js';

export const verifyToken = (req, res, next) => {

    try{
        let token = req.cookies.accessToken;

        if(!token){
            return res.status(403).send('Access Denied');
        }

        if (token.startsWith("Bearer ")){
            token = token.split(' ')[1];
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return res.status(403).send('Access Denied');
            }
            req.user = user;
            return next();
        });

    }catch(error){
        res.status(500).json({ error: error.message })
    }

}

export const refreshToken = async (req, res, next) => {

    const token = req.cookies.refreshToken;
    if(!token) return res.status(401);
    const isToken = await Token.findOne({ refreshToken: token });
    if(!isToken) return res.status(401);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, payload) => {
        if(err !== null) return res.status(403).json({ error: err });
        const user = await User.findOne({ _id: payload.id });
        if(!user) return res.status(403).json({ message: "No one is logged in!" });
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.cookie('accessToken', accessToken);
        return res.status(200).json({ accessToken: accessToken });
    });

}