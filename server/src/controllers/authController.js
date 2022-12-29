import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

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