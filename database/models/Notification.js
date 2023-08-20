import mongoose from 'mongoose';

const Mongoose  = require('mongoose');


const notificationSchema = new Mongoose.Schema({
        originatedFromUsername:{type:String,required:true},
        notifications:[{
            _id:Mongoose.Schema.Types.ObjectId, 
            destinatedUsername:{type:String,required:true},
            status:{type:String,enum:['S','A','D','U'], default:'U'},   // seen, accept , delete ,  unseen
            generatedAt:{type:Date,default:Date.now},
            type:{type:String,enum:['request','accept']} , // request = when request comes accept = when request comes
            }
        ],

        
        
});

notificationSchema.methods.updateStatus = async function(status){
    this.status = status;
    return await this.save();
}

notificationSchema.virtual('count').get(function(){
    return this.notifications.length;
})





const Notification = Mongoose.model("Notification",notificationSchema);


export default Notification;