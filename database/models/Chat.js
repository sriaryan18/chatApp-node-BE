const Mongoose  = require("mongoose");
const Schema = Mongoose.Schema

const chatSchema = new Schema({
    chatType:{type:'String',enum:['personal','chatroom'],required:true},
    messages:[
      {type:Mongoose.Schema.Types.ObjectId,ref:'Message'}
    ]
})


const Chat = Mongoose.model("Chat",chatSchema);

module.exports= Chat;