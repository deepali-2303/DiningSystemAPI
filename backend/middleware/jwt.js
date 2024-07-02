import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id, admin) => {
    console.log(admin);
    var key = process.env.JWT_SECRET;
    if(admin) {
        key = process.env.JWT_ADMIN_SECRET;
    }
    else
    {
       key = process.env.JWT_SECRET;
    }
    return jwt.sign({id: id}, key, {
        expiresIn: '30d'
    });
};

const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        throw new Error('Invalid token');
    }
};



export {generateToken, verifyToken};