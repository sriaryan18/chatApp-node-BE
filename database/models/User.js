const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const userSchema =  new Schema({
  username: { type: String, required: true,unique:true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: null },
  emailId: { type: String, required: true },
  connectRequests :[{
    targetUsername:{type:String,ref:'User'},
    timeStamp:{type:Date,default:Date.now}
  }],
  connects:[
    {
      username:{type:String,ref:'User'},
      chatId:{type:mongoose.Schema.Types.ObjectId,ref:'Chat'}
    }
  ],
  chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }],
  meta: { type: mongoose.Schema.Types.Mixed },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.pre('save',  async function(next){
  if(!this.isModified) next();
   const salt= await bcrypt.genSalt(10);
  const hashedPassword= await bcrypt.hash(this.password,salt);
  this.password = hashedPassword;

})


const User= mongoose.model("User",userSchema);

module.exports= User;