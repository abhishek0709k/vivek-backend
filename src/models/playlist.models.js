const { Schema, model } = require("mongoose")

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    videos: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Playlist = model("Playlist", playlistSchema)

module.exports = Playlist;