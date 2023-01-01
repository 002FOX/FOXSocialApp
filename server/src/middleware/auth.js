import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {

    try{
        let token = req.cookies.accessToken

        if(!token){
            return res.status(403).send('Access Denied');
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