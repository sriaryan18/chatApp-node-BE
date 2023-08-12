const { default:Chat } = require('../database/models/Chat');

const allMessagesById = async (req,res)=>{
    const chatID = req.query.chatID;
    try{

        const chat = await Chat.findById(chatID);
        if(chat){
            res.status(200).send(chat.messages);  // :TODO send this based on pagination or limit the number of messages
        }

    }catch(err){
        console.log(err);
        res.status(400).send("Could not fetch chats at the moment");
    }
    
}


module.exports = {
    allMessagesById
}