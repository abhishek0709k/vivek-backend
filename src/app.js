const express = require("express")
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user.routes.js')
const videoRouter = require("./routes/video.routes.js")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.static('../public'))
app.use(cookieParser())

// routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

module.exports = app;