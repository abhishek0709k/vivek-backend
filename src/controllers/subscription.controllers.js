const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const APIResponse = require("../utils/apiResponse.js");
const Subscription = require("../models/subscriptions.models.js");
const User = require("../models/user.models.js");

const handleCreateSubscription = asyncHandler(async(req, res)=>{
    const { channelId } = req.params;
    const user = await User.findById(channelId).select("-password -refreshToken")
    if(!user){
        return res.status(400).json(new APIError("You are logged out", 400))
    }
    const newSubscription = await Subscription.create({
        subscriber: user._id,
        channel: user
    })
    return res.status(200).json(new APIResponse(200, newSubscription, "Subscription created Successfully"))
})
const handleToggleSubscription = asyncHandler(async (req, res)=>{
    const { channelId } = req.params;
    const user = await User.findById(channelId).select("-password -refreshToken")
    if(!user){
        return res.status(400).json(new APIError("You are logged out", 400))
    }
    user.isSubscribed = !user.isSubscribed
    await user.save()

    return res.status(200).json(new APIResponse(200, user, "Status changed successfully"))
    
})

const handleGetUserChannelSubscribers = asyncHandler(async (req, res)=>{
    const { channelId } = req.params;
    const user = await User.findById(channelId)
    if(!user){
        return res.status(400).json(new APIError("You are logged out", 400))
    }
    return res.status(200).json(new APIResponse(200, {"SubscibersCount": user.subscribersCount}, "Subscribers fetched successfully"))
})

const handleGetSubscribedChannels = asyncHandler(async (req, res)=>{
    const { channelId } = req.params;
    const user = await User.findById(channelId)
    if(!user){
        return res.status(400).json(new APIError("You are logged out", 400))
    }
    return res.status(200).json(new APIResponse(200, {"SubscribedToCount": user.subscribedToCount}, "Subscribers fetched successfully"))
})
module.exports = {
    handleCreateSubscription,
    handleToggleSubscription,
    handleGetUserChannelSubscribers,
    handleGetSubscribedChannels
}