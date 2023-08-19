const  Chat = require("../database/models/Chat");
const  Message = require("../database/models/Messages");
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


const checkDatabaseIfReqAlreadySent = async (fromUsername,toUsername)=>{
    try{

        const user =await User.findOne(
         {username:fromUsername}
        );
         if(user){
            const connectRequests = user?.connectRequests;
            let isPresent = false;
            connectRequests.forEach((req)=>{
                if(req.targetUsername === toUsername) isPresent = true;
            });
            console.log('isPresent',isPresent);
            return isPresent;
         }
      
    }catch(err){
        console.log("error at check",err)
        return false;
    }
}
const saveConnectionRequest = async (from,to)=>{
    try{
        const result = await User.updateOne(
            { username: from },
            {
              $push: {
                connectRequests: { targetUsername: to }
              }
            }
          );
          
          console.log("Number of documents updated:", result);
          
          return result?true:false   ;
        
    }catch(err){
        console.log("err",err)
        return false;
    }
}

module.exports = {saveMessageDb,checkDatabaseIfReqAlreadySent,saveConnectionRequest}