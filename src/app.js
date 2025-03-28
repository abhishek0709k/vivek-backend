const express = require("express")
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user.routes.js')
const videoRouter = require("./routes/video.routes.js")
const subscriptionRouter = require("./routes/subscription.routes.js")
const playlistRouter = require("./routes/playlist.routes.js")
const commentRouter = require("./routes/comment.routes.js")
const tweetRouter = require("./routes/tweet.routes.js")
const dashboardRouter = require("./routes/dashboard.routes.js")

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
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);

module.exports = app;