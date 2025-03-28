const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const APIResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.models.js");
const User = require("../models/user.models.js");

const handleGetAllVideosByUserId = asyncHandler(async (req, res)=>{
    const allVideos = await Video.find({ owner: req.user._id })
    return res.status(200).json(new APIResponse(200, { "All videos": allVideos, "Total Videos": allVideos.length}, "Video fetched successfully"))
});

const handleGetAllViews = asyncHandler(async (req, res)=>{
    const allViews = await Video.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])
    return res.json(new APIResponse(200, allViews[0].totalViews, "Views fetched successfully"))
});

const handleGetAllSubscribers = asyncHandler(async (req, res)=>{
    const allSubscribers = await User.aggregate([
        {
            $match: {
                _id: req.user._id
            }
        },
        {
            $group: {
                _id: null,
                totalSubcribers: { $sum: "$subscribersCount" }
            }
        }
    ])
    return res.json(new APIResponse(200, allSubscribers[0].totalSubcribers, "Views fetched successfully"))
});


module.exports = {
    handleGetAllVideosByUserId,
    handleGetAllViews,
    handleGetAllSubscribers,
}