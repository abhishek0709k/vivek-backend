const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const APIResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.models.js");
const Comment = require("../models/comments.models.js")

const handleGetVideoComment = asyncHandler(async (req, res)=>{
    const { videoId } = req.params;
    if(!videoId){
        return res.status(400).json(new APIError("vidoe id is required", 400));
    }
    const comment = await (await Comment.find({ video: videoId }))
    if(!comment){
        return res.status(400).json(new APIError("videoId is invalid", 400))
    }
    return res.status(200).json(new APIResponse(200, comment, "Comment fetched successfully"))
})

const handleAddComment = asyncHandler(async (req, res)=>{
    const { content } = req.body;
    const { videoId } = req.params;
    if(!content || !videoId){
        return res.status(400).json(new APIError("Fields are required"));
    }
    const newComment = await Comment.create({
        content, 
        owner: req.user._id,
        video: videoId
    });
    if(!newComment){
        return res.status(400).json(new APIError("Error while posting the comment in the database", 400));
    }
    return res.status(200).json(new APIResponse(200, newComment, "Comment added successfully"))
})

const handleUpdateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { newContent } = req.body;
    if(!commentId || !newContent) {
        return res.status(400).json(new APIError("Fiels are required for updation", 400))
    }
    const comment = await Comment.findById(commentId);
    if(!comment) {
        return res.status(400).json(new APIError("Commentid is invalid", 400))
    }
    comment.content = newContent;
    await comment.save();
    return res.status(200).json(new APIResponse(200, comment, "Comment updated successfully"))
})

const handleDeleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    await Comment.findOneAndDelete(commentId)
    return res.status(200).json(new APIResponse(200, {}, "Comment deleted successfully"))
})

module.exports = {
    handleGetVideoComment,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment
}