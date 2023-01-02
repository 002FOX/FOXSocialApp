import jwt from 'jsonwebtoken';
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
    if(!token) return res.status(401).send("No one logged in");

    const foundUser = await User.findOne({ refreshTokens: token });

    if(!foundUser){ 
        return res.status(403);
    }

    const newRefreshTokenArray = foundUser.refreshTokens.filter(rt => rt !== token);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, payload) => {

        if(err){
            foundUser.refreshTokens = [...newRefreshTokenArray];
            await foundUser.save();
            return res.status(403).json({ error: err });
        }

        const user = await User.findOne({ _id: payload.id });
        if(!user) return res.status(403).json({ message: "No one is logged in!" });

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "24h" });
        
        user.refreshTokens = [...newRefreshTokenArray, refreshToken];
        await user.save();

        res.cookie('accessToken', accessToken , { httpOnly: true }).cookie('refreshToken', refreshToken, { httpOnly: true });
        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    });

}