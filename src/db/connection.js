const mongoose = require("mongoose")
const MongooseStoreName = require("../constants.js")
async function connection(){
    try {
        return await mongoose.connect(`${process.env.MONGOOSE_URL}/${MongooseStoreName}`)
    } catch (error) {
        console.log("MongoDB connection error" , error)
    }
}

module.exports = connection;