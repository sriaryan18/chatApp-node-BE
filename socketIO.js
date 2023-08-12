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

        socket.on('message',(data)=>{
            try{

                const receiver = data.to;
                onlineUsers[receiver].emit('message-personal',data.message);
            }catch(err){
                console.log(`${data.to} is not online`); // push the message to message cache of the receiver
            }
        })

        socket.on('disconnect',()=>{
            const usernameDisconnected = reverseLoopkup[socket.id];
            delete onlineUsers[usernameDisconnected];
            delete reverseLoopkup[socket.id];
            console.log("I am online users after disconnection",Object.keys(onlineUsers));
        })
    });
}

module.exports = {SocketIo};