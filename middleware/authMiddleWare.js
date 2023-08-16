const jwt  = require('jsonwebtoken');

const authenticateJWT = (req,res,next)=>{
    try{
        // console.log("I am req",req);
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

const autheticateJWTsockets = (socket,next)=>{
    try{
       
    const token = socket?.handshake?.query?.token;
    // console.log("I am token=>",socket);
    if(!token){
        next(new Error("Authetication Error"));
    }
    const isVerified = jwt.verify(token,process.env.SECRET_KEY_LOGIN);
    if(isVerified) next();
    else{
        next(new Error("Authetication Error"));
    }
    
    }catch(err){
        next(new Error("Authetication Error"));
    }
    
}

module.exports = {authenticateJWT,autheticateJWTsockets}