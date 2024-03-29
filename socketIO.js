const {saveMessageDb,
    checkDatabaseIfReqAlreadySent,
    saveConnectionRequest,
    saveConnectionRequestSent, deleteNotification
}  = require('./utils/DatabaseUtils')
const {checkIfUserOnline} = require("./utils/helper");

const SocketIo = (io)=>{
    const onlineUsers={};
    const reverseLoopkup={};

    io.on('connection',(socket)=>{
        console.log("Client connected",socket.id);
        socket.on('iAmOnline',(data)=>{
            onlineUsers[data.username] = socket;
            reverseLoopkup[socket.id] = data.username;
            console.log("I am online users",Object.keys(onlineUsers))
        });

        socket.on('message-personal-server',async (data)=>{
            try{
                console.log("I am msg",data)
                 saveMessageDb(data);
                const receiver = data.to;
                onlineUsers[receiver].emit('message-personal',data);
            }catch(err){
                console.log(`${data.to} is not online`); // push the message to message cache of the receiver
            }
        });

        socket.on('typing-personal-server',async (data)=>{
            try{
                const receiver = data.to;
                onlineUsers[receiver].emit('typing-personal',data.message);
                
            }
            catch(err){
                console.log(`${data.to} is not available`);
            }
        });

        socket.on('disconnect',()=>{
            const usernameDisconnected = reverseLoopkup[socket.id];
            delete onlineUsers[usernameDisconnected];
            delete reverseLoopkup[socket.id];
            console.log("I am online users after a disconnection",Object.keys(onlineUsers));
        });
        socket.on('friendRequest',async (data)=>{
            const {destinatedUsername,originatedFromUsername,type} = data;
            if(originatedFromUsername === destinatedUsername) return;
            try{
                const isAlreadySent=await checkDatabaseIfReqAlreadySent(originatedFromUsername,destinatedUsername,type);
                console.log('I am AlreadySent',isAlreadySent);
                if(!isAlreadySent){
                    const targetUserSocket = onlineUsers[destinatedUsername];
                    if(targetUserSocket){
                        targetUserSocket.emit('friendRequest',{originatedFromUsername,type});
                    }
                    await saveConnectionRequestSent(originatedFromUsername,destinatedUsername,type  );
                }
            }catch(err){
                console.log("Something went wrong...",err)
            }
        });
        socket.on('friendRequestDelete', (data)=> {
            deleteNotification(data)
        });
        socket.on('videoCall',(data)=>{
            try{
                const {destinatedUsername,sourceUsername,offer = null,type} = data;
                if(type === 'REQUEST'){
                    const isOnline = checkIfUserOnline(onlineUsers,destinatedUsername);
                    if(!isOnline){
                        onlineUsers[sourceUsername].emit('videoCall',{
                            status:'OFFLINE',
                            message:'USER IS OFFLINE'
                        })
                    }else{
                        onlineUsers[destinatedUsername].emit('videoCall',{
                            status:'CALL_RECEIVING',
                            originatedFrom : sourceUsername,
                            offer
                        })
                    }

                }
                else if(type ==='CALL_CUT'){
                    const isOnline = checkIfUserOnline(onlineUsers,destinatedUsername);
                    if(isOnline){
                        onlineUsers[destinatedUsername].emit('videoCall',{
                            type,
                            message:'USER CUT THE CALL'
                        })
                    }
                }

            }catch (e){

            }

        })
    });
}

module.exports = {SocketIo};