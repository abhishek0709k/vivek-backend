const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const APIResponse = require("../utils/apiResponse.js");
const Tweet = require("../models/tweets.models.js");

const handleCreateTweet = asyncHandler(async (req, res)=>{
    const { content } = req.body;
    if(!content){
        return res.status(400).json(new APIError("Content is required", 400));
    }
    const newTweet = await Tweet.create({
        tweetBy: req.user._id,
        content
    });
    if(!newTweet) {
        return res.status(400).json(new APIError("Error while posting in the database"));
    }
    return res.status(200).json(new APIResponse(200, newTweet, "Tweet created successfully"));
})

const handleGetUserTweets = asyncHandler(async (req, res)=>{
    const { userId } = req.params;
    const tweets = await Tweet.find({ tweetBy: userId });
    return res.status(400).json(new APIResponse(200, tweets, "Tweet fetched successfully"));
})

const handleUpdateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if(!content || !tweetId){
        return res.status(400).json(new APIError("Content and id is required", 400));
    }

    const tweet = await Tweet.findById(tweetId);
    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new APIResponse(200, tweet, "Tweets updated successfully"))
});

const handleDeleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if(!tweetId){
        return res.status(400).json(new APIError("Content and id is required", 400));
    }
    await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(new APIResponse(200, {}, "Tweet deleted successfully"))
});

module.exports = {
    handleCreateTweet,
    handleGetUserTweets,
    handleUpdateTweet,
    handleDeleteTweet
}