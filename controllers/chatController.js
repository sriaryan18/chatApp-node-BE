const Chat  = require('../database/models/Chat');
const Message = require('../database/models/Messages');

const getMessages = async (req,res)=>{
    const chatID = req.query.chatID;
    // const offset = req.query.offset; // TODO
    try{
        const chat = await Chat.findById(chatID);
        if(chat){
            const actualMessages =  await Message.find({
                _id:{$in:chatID.messages}
            });
            res.status(200).send(chat.messages);  // :TODO send this based on pagination or limit the number of messages
        }

    }catch(err){
        console.log(err);
        res.status(400).send("Could not fetch chats at the moment");
    }
    
}


module.exports = {
    getMessages
}