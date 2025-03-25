const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const APIResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.models.js");
const { mongoose } = require("mongoose");

const handleGetAllVideos = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $addFields: {
        owner: "$owner._id"
      }
    },
    {
      $project: {
        title: 1,
        discription: 1,
        views: 1,
        duration: 1,
        videoFile: 1,
        thumbnail: 1,
        owner: 1
      }
    }
  ])

  return res
    .status(200)
    .json(new APIResponse(200, videos, "All Videos fetched"));
});

const handlePublishVideo = asyncHandler(async (req, res) => {
  const { title, discription } = req.body;
  if (!title || !discription) {
    return res
      .status(400)
      .json(new APIError("Title and discription is required", 400));
  }

  const thumbnailFilePath = req.files?.thumbnail?.[0]?.path;
  const videoFilePath = req.files?.video?.[0]?.path;

  if(!thumbnailFilePath || !videoFilePath){
    return res.status(400).json(new APIError("thumbnail and video is required", 400))
  }
  const thumbnailFileData = await uploadOnCloudinary(thumbnailFilePath);
  const videoFileData = await uploadOnCloudinary(videoFilePath);

  if (!thumbnailFileData || !videoFileData) {
    return res
      .status(400)
      .json(
        new APIError("Error while uploading the files on the cloudinary", 400)
      );
  }
  const newVideo = await Video.create({
    title,
    discription,
    videoFile: videoFileData?.url,
    thumbnail: thumbnailFileData?.url,
    isPublished: true,
    duration: videoFileData.duration,
    owner: req.user._id
  })
  return res
    .status(200)
    .json(new APIResponse(200, newVideo, "Video published successfully"));
});

const handleGetVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!videoId){
    return res.status(400).json(new APIError("Video Id is required", 400));
  }
  const video = await Video.findById(videoId);
  return res.status(200).json(new APIResponse(200, video, "Video fetched successfully"));
});

const handleUpdateVideoDetails = asyncHandler(async (req, res)=>{
    const { videoId } = req.params;
    const { title, discription } = req.body;

    const thumbnailFilePath = req.file?.path;
    if(!title || !discription || !thumbnailFilePath){ 
        return res.status(400).json(new APIError("Fields are required", 400));
    }
    const thumbnailFileData = await uploadOnCloudinary(thumbnailFilePath);
   
    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            discription,
            thumbnail: thumbnailFileData.url,
        },
    }, {new: true})
    return res.status(200).json(new APIResponse(200, updatedVideo, "Video Details Updated Successfully"));
});

const handleDeleteVideo = asyncHandler(async (req, res)=>{
  const { videoId } = req.params;
  const deleteVideo = await Video.findByIdAndDelete(videoId);
  if(!deleteVideo){
    return res.status(400).json(new APIError("Video not found", 400))
  }
  return res.status(200).json(new APIResponse(200, { videoId: videoId }, "Video deleted Successfully"))
});

const handleTogglePublishStatus = asyncHandler(async (req, res)=>{
    const { videoId } = req.params;
    console.log(videoId)
    const video = await Video.findById(videoId)
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new APIResponse(200, video, "Published Status change successfully"))
});

module.exports = {
  handleGetAllVideos,
  handlePublishVideo,
  handleGetVideoById,
  handleUpdateVideoDetails,
  handleDeleteVideo,
  handleTogglePublishStatus
};
