const  Chat = require("../database/models/Chat");
const  Message = require("../database/models/Messages");
const Notification = require("../database/models/Notification");
const User = require("../database/models/User");

const saveMessageDb = async (data)=>{
    try{
         const chatID = data.chatID;
    const message = await Message.create({
        message:data.message,
        sender:data.from,
        receiver:data.to,
        status:'S',
        timeStamp:new Date(),
        type:data.type
    });
    const messageId = message._id;
    await Chat.create({
        chatType:data.type || "personal",
        messages:messageId
    });

    }catch(err){
        console.log("Error at saving sent message",err);
    }
   
}


const checkDatabaseIfReqAlreadySent = async (fromUsername,toUsername,type = 'request')=>{
    try{
        const notification = await  Notification.findOne({
            destinatedUsername:toUsername
        });
        return notification?.checkIfNotificationSent(fromUsername,toUsername,type);

    }catch(err){
        console.log("Something went wrong for checking db if request exists by",fromUsername,"to",toUsername,err);
    }
}
const saveConnectionRequestSent = async (from,to,type)=>{
    try{
        const options = {
            new:true,
            upsert:true,
            setDefaultsOnInsert:true
        }
        const query  = {destinatedUsername:to};
        const notificationData = {
            originatedFromUsername:from,
            type:type
        }
        const updateData = {
            $push:{notifications:{
                    $each:[{...notificationData}],
                    $position:0
                }
            }
        }

       const notification = await Notification.findOneAndUpdate(query,updateData,options);   
       console.log("I am updated data of notifications data",notification);
    }catch(err){
        console.log("err",err)
        return false;
    }
}


// const saveConnectionRequestReceived = async (to,from,type)=>{
//     try{

//         const result  = await User.updateOne(
//             {username:to},
//             {
//                 $push:{
//                     notifications:{
//                       $each:[{type:type,from:from}],
//                       $position: 0 
//                     }
//                 }
//             }
//         );
//         return result?true:false;
//     }catch(err){
//         console.log("err",err);
//         return false;
//     }
// }


module.exports = {saveMessageDb,checkDatabaseIfReqAlreadySent,saveConnectionRequestSent}