const asyncHandler=require('express-async-handler');
const Notification = require('../database/models/Notification');
const getNotifications = asyncHandler(async(req,res)=>{
    try{
        const username  = req.query.username;
        const offset = req.query.offset;
        const user = await Notification.findOne({
            destinatedUsername:username
        });
        if(username){
            const notifications = user.notifications.slice(offset,offset+10);
            res.status(200).send(notifications);
        }
    }catch(err){
        res.status(400).send("Error at fetching notifications",err);
        throw new Error('Error at fetching notifications');
    }
});

const acceptOrDeleteRequest = asyncHandler(async(req,res)=>{
    try{
        const destinatedUsername = req.query.destinatedUsername;
        const originatedFromUsername = req.query.originatedFromUsername;
        const type = req.query.type;
        const notificationObj = await Notification.findOne({
            destinatedUsername:destinatedUsername
        });
        response = await notificationObj?.acceptOrDeleteReq(originatedFromUsername,type);
        console.log(">>>",response)
        if(response==true){
            res.status(200).send("Operation Successfull....")
        }
        else{
            res.status(500).send("Operation UnSuccessfull....")
        }
    }catch(err){
        console.log("Something went went wrong ", err);
    }
})



module.exports={
    getNotifications,
    acceptOrDeleteRequest
}