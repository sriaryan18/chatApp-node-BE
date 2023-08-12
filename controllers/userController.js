const express=require('express');
const router=express.Router();
const asyncHandler=require('express-async-handler');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require('../database/models/User');

const findAllUsers = asyncHandler(async (req,res)=>{
    const users=await User.find({});
    res.send(JSON.stringify(users));
});

const getConnections = asyncHandler(async (req,res)=>{
    const connections = await User.findOne({
        'username':req.query.username  // username of the user who has just logged in
    });
    if(!connections){
        res.status(400).send("No Connections found")
    }
    console.log("I am user",connections.connects)
    
    res.send(JSON.stringify(connections.connects));
});

const addNewUser = asyncHandler(async (req,res)=>{
    const {username,password,email,name} =req.body;
    try{

        const existingUser = await User.findOne({
            'username':username
        });
        if(existingUser){
            res.send("USER ALREADY EXISTS").status(409);
            throw new Error("USER ALREADY EXISTS");
        }
 
        const newUser =await User.create({
            username:username,
            emailId:email,
            name:name,
            password:password
        });

    
      
        res.send(JSON.stringify({
            username,
            email,
            name

        }));
    }catch(err){
        res.status(400);
        console.log(err)
        throw new Error(err)    
    }
})

const checkUserName = asyncHandler(async (req,res)=>{
    const username=req.query.username;
    const user=await User.findOne({
        'username':username
    });
    res.send( user?false:true);
});

const login = asyncHandler(async(req,res,next)=>{
    try{
         const {username,password} = req.body;
        const isUsernamePresent = await User.findOne({
            username:username
        });
        if(!isUsernamePresent){
            res.status(400).send("USERNAME DOES NOT EXISTS")
//            throw new Error("USER DOES NOT EXISTS");
        }
        else{
             const isPasswordVerified=await isUsernamePresent.matchPassword(password);
            console.log("I am isPasswordVerified",isPasswordVerified)
            if(!isPasswordVerified){
                res.status(400).send("PASSWORD AND USERNAME DOES NOT MATCH");
            }
            else{
                const token = jwt.sign({username},process.env.SECRET_KEY_LOGIN,{
                    expiresIn:process.env.JWT_EXPIRE_TIME
                });
                res.status(200).send(token);
            }
        }
       
    }catch{
        res.status(400);
        throw new Error("ERROR IN LOGIN OF USERCONTROLLER");
    }
   
})

module.exports = {
    findAllUsers,
    getConnections,
    addNewUser,
    checkUserName,
    login
}
