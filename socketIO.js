const {saveMessageDb, checkDatabaseIfReqAlreadySent, saveConnectionRequest}  = require('./utils/DatabaseUtils')

const SocketIo = (io)=>{
    const onlineUsers={};
    const reverseLoopkup={};

    io.on('connection',(socket)=>{
        console.log("Client connected",socket.id);
        // autheticateJWTwebSockets(socket);
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
                onlineUsers[receiver].emit('message-personal',data.message);
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
        })

        socket.on('disconnect',()=>{
            const usernameDisconnected = reverseLoopkup[socket.id];
            delete onlineUsers[usernameDisconnected];
            delete reverseLoopkup[socket.id];
            console.log("I am online users after a disconnection",Object.keys(onlineUsers));
        })
        socket.on('friend-request',async (data)=>{
            const {to,from} = data;
            if(to === from) return;
            try{
                const isAlreadySent=await checkDatabaseIfReqAlreadySent(from,to);
                console.log('I am AlreadySent',isAlreadySent);
                if(!isAlreadySent){
                    const targetUserSocket = onlineUsers[to];
                    if(targetUserSocket){
                        targetUserSocket.emit('friendRequest',{from});
                    }
                    await saveConnectionRequest(from,to);
                }
            }catch(err){
                console.log("Something went wrong...",err)
            }
            

        })
    });
}

module.exports = {SocketIo};