const bodyParser = require('body-parser');
const {connectDB} = require('./database/connection');
require("dotenv").config();
const {errorHandler,notFound} =
    require('./middleware/errorHandlerMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const express = require('express');
const cors = require('cors');
const {SocketIo}  = require('./socketIO');
const { authenticateJWT, autheticateJWTsockets }
    = require('./middleware/authMiddleWare');
const app =express();

const server =require('http').createServer(app)
const io = require('socket.io')(server,{
    cors: {
        origin: process.env.FRONTEND_HOST
      }
});



app.use(cors({
    origin:process.env.FRONTEND_HOST
}))


app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("HELLO FROM CHAT APP");
});

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);
app.use(errorHandler);
app.use(notFound);
 

// *Websockets connection and configuration starts*//
io.use(autheticateJWTsockets)
SocketIo(io);

const port = process.env.PORT || 3000
server.listen(port,()=>{
    connectDB();
    console.log("Listening to port 3000");

});