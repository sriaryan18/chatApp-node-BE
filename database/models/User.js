const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const userSchema =  new Schema({
  username: { type: String, required: true,unique:true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: null },
  emailId: { type: String, required: true },
    connectRequestsSent :[{
      targetUsername:{type:String},
      timeStamp:{type:Date,default:Date.now}
    }],
  notifications:[{
    type:{type:String,enum:['accepted','requested']},
    from:{type:String},
    timeStamp:{type:Date, default:Date.now},
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
  if(!this.isModified('password')) next();
  console.log("I am password");
  const salt= await bcrypt.genSalt(10);
  const hashedPassword= await bcrypt.hash(this.password,salt);
  this.password = hashedPassword;
});

userSchema.methods.checkIfAlreadyFriends =  function(toUsername){
  const l = this.connects;
   for(let i=0;i<l.length;i++){
    if(l[i].username === toUsername) return true;
   }
   return false;
}
userSchema.methods.addToConnect = async function(username,chatId){
  console.log("I am at originatedFromUsername,chatId",username,chatId);
  this.connects.push({
    username:username,
    chatId:chatId
  });
  await this.save();
}

userSchema.virtual('LoginSuccessData').get(function(){
    return{
      username:this.username, 
      name:this.name,
      email:this.emailId,
      meta:this.meta,
      notifications:{ 
          sent:this.connectRequestsSent.slice(0,5),
          notificationsReceived:this.notifications.slice(0,10)
      }
    }
});


const User= mongoose.model("User",userSchema);

module.exports= User;