const { Schema, model } = require("mongoose")

const tweetSchema = new Schema({
    tweetBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;