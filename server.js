const bodyParser = require('body-parser');
const {connectDB} = require('./database/connection');
require("dotenv").config();
const {errorHandler,notFound} = require('./middleware/errorHandlerMiddleware');
const userRoutes = require('./routes/userRoutes')
const express = require('express');
const cors = require('cors');
const app =express();

app.use(cors({
    origin:'http://localhost:5173'
}))
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("HELLO FROM CHAT APP");
});

app.use('/user',userRoutes)

app.use(errorHandler);
app.use(notFound);

app.listen(3000,()=>{
    connectDB();
    console.log("Listening to port 3000");

});