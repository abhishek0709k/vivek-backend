require('dotenv').config()
const app = require('./app.js')
const MongoDBconnection = require("./db/connection.js")
const port = process.env.PORT
// iife --> first approach
// ( async ()=>{
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/backend-project')
//         app.on("error" , (error)=>{
//             console.error("Error" , error)
//         })
//     } catch (error) {
//         console.error("Error" , error)
//     }
// } )()

MongoDBconnection().then(()=>{
    console.log("MongoDB connected")
}).catch(()=>{
    console.log("Connection Error")
})

app.listen(port , ()=>{
    console.log(`Server is running of PORT : ${port}`)
})