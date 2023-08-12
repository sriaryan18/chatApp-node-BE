const jwt  = require('jsonwebtoken');

const authenticateJWT = (req,res,next)=>{
    try{
        const token =  req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        const isVerified = jwt.verify(token,process.env.SECRET_KEY_LOGIN);
        if(isVerified) next();
        else {
        res.status(401).send("NOT AUTHORIZED TO VIEW THIS ROUTE")
        }
    }catch(err){
        throw new Error("ERROR AT AUTHENTICATEJWT",err)
    }
   

}

module.exports = {authenticateJWT}