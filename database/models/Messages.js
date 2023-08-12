const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now }, // Corrected default value
  status: { type: String, default: "S" }, // S = Sent
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, default: "text" },
  meta: { type: mongoose.Schema.Types.Mixed },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;