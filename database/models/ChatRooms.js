const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
  roomName: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chatId:{type:mongoose.Schema.Types.ObjectId,ref:'Chat',required:true},
  participants:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  meta: { type: mongoose.Schema.Types.Mixed },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;