const express = require("express")
const cors = require('cors')
const app = express()
const userRouter = require('./routes/user.routes.js')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.static('../public'))

// calling routers
app.use("/api/v1/users" , userRouter)

module.exports = app;