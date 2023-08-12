const mongoose = require('mongoose');


const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(async () => {
      console.log('Connected with DB');
     
    })
    .catch((err) => {
      console.log('ERROR IN CONNECTING WITH DB',err);
    });
};

module.exports = { connectDB };
