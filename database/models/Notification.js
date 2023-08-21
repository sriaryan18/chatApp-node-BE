const Mongoose  = require('mongoose');


const notificationSchema = new Mongoose.Schema({    
    destinatedUsername:{type:String,required:true},
        notifications:[{
            originatedFromUsername:{type:String,required:true},
            status:{type:String,enum:['S','A','D','U'], default:'U'},   // seen, accept , delete ,  unseen
            generatedAt:{type:Date,default:Date.now},
            type:{type:String,enum:['request','accept']} , // request = when request comes accept = when request comes
            }
        ]     
});

notificationSchema.methods.updateStatus = async function(status){
    this.status = status;
    return await this.save();
}

notificationSchema.methods.addNewNotification = async function(notificationObject){
    await this.notifications.unshift(notificationObject);
    return  this.save();
}

notificationSchema.methods.checkIfNotificationSent = async function(from,to,type){
    let res = false;
    this.notifications.forEach(element => {
        if(element.originatedFromUsername === from && element.type === type){
            res = true ;
        }
    });
    return res;
}

notificationSchema.virtual('count').get(function(){
    return this.notifications.length;
})





const Notification = Mongoose.model("Notification",notificationSchema);


module.exports = Notification