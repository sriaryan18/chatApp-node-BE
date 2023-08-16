const  Chat = require("../database/models/Chat");
const  Message = require("../database/models/Messages");

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

module.exports = {saveMessageDb}