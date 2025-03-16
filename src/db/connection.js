const mongoose = require("mongoose")
const MongooseStoreName = require("../constants.js")
async function connection(){
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URL}/${MongooseStoreName}`)
        .then(()=>{
            console.log("mongoDB connected")
        })
    } catch (error) {
        console.log("MongoDB connection error" , error)
    }
}

module.exports = connection;