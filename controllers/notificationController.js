const asyncHandler=require('express-async-handler');
const User = require('../database/models/User');
const getNotifications = asyncHandler(async(req,res)=>{
    try{
        const username  = req.query.username;
        const offset = req.query.offset;
        const user = await User.findOne({
            username:username
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

/**\
 * Accepting the request means remove the request from notifications 
 * and add the user in connects with a new chatID in both the user's connect box.
 */

const acceptRequest = asyncHandler(async(req,res)=>{
    //  step1
    const username = req.query.username;
     
})



module.exports={
    getNotifications
}