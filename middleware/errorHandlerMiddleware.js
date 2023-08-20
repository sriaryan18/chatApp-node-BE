const errorHandler = (err,req,res,next)=>{
    console.log(err)
    res.send("ERROR OCCURED")
}
const notFound = (req,res,next)=>{
    res.status(400).send("NOT FOUND");

}

module.exports={errorHandler,notFound}