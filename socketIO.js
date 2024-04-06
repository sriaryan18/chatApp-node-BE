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
        socket.on('videoCallRequest',(data)=>{
            try{
                console.log('ncdjksn');
                const {destinatedUsername,sourceUsername,offer = null} = data;
                const isOnline = checkIfUserOnline(onlineUsers,destinatedUsername);
                if(!isOnline){
                    onlineUsers[sourceUsername].emit('videoCallResponse-client',{ // NOTE: both *-client can be clubbed but making them seperate for UI .
                        type:'OFFLINE',
                        message:'USER IS OFFLINE'
                    })
                }else{
                    console.log("I am online",data);
                    onlineUsers[destinatedUsername].emit('videoCallRequest-client',{
                        type:'CALL_RECEIVING',
                        originatedFrom : sourceUsername,
                        offer
                    })
                }
            }catch (e) {
                console.log(e)
            }
        });
        socket.on('videoCallResponse',(data)=>{
            const {destinatedUsername,sourceUsername,offer = null,type} = data;
            console.log(data,'at videoCallResponse')
            const isUserOnline = checkIfUserOnline(onlineUsers,destinatedUsername);
            /**
             * accepted types are : CALL_CUT, BUZY,
             *
             */
            if(isUserOnline){
                if(type === 'CALL_CUT' || type === 'BUZY'){
                    const message = type === 'CALL_CUT' ? 'USER CUT THE CALL' : 'USER IS BUZY IN ANOTHER CALL'
                    onlineUsers[destinatedUsername].emit('videoCallResponse-client',{
                        type,
                        message
                    })
                }
                else{
                    onlineUsers[destinatedUsername].emit('videoCallResponse-client',{
                        type,
                        destinatedUsername,
                        originatedFromUsername: sourceUsername,
                        offer
                    })
                }
            }

        })
    });

}

module.exports = {SocketIo};