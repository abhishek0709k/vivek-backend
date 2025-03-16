require('dotenv').config()
const express = require('express');
const app = express();
const MongoDBconnection = require("./db/connection.js")
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

MongoDBconnection()