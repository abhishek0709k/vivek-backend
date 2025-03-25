const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const APIResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.models.js");
const User = require("../models/user.models.js");
const Playlist = require("../models/playlist.models.js");

const handleCreatePlaylist = asyncHandler(async (req, res)=>{
    const { name, discription } = req.body;
    if(!name || !discription){
        return res.status(400).json(new APIError("Fields are required", 400))
    }
    const newPlaylist = await Playlist.create({
        name,
        discription,
        owner: req.user._id
    })
    return res.status(200).json(new APIResponse(200, newPlaylist, "Playlish made successfully"))
})

const handleGetUserPlaylist = asyncHandler(async (req, res)=>{
    const { userId } = req.params;
    const playlist = await Playlist.find({ owner: userId });
    if(!playlist){
        return res.status(400).json(new APIError("Not created any playlist", 400))
    }
    return res.status(200).json(new APIResponse(200, playlist, "Playlist fetched successfully"))
})

const handleGetPlaylistById = asyncHandler(async (req, res)=>{
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        return res.status(400).json(new APIError("playlist is not created", 400));
    }
    return res.status(200).json(new APIResponse(200, playlist, "Playlist fetched successfully"))
});

const handleAddVideoToPlaylist = asyncHandler(async (req, res)=>{
    const { playlistId, videoId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    playlist.videos.push(video)
    await playlist.save()

    return res.status(200).json(new APIResponse(200, playlist, "Video is added to the playlist "))
});

const handleRemoveVideoFromPlaylist = asyncHandler(async (req, res)=>{
    const { playlistId, videoId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    playlist.videos.pull(videoId) // pull is used to remove the given parameters in mongoose
    await playlist.save()

    return res.status(200).json(new APIResponse(200, playlist, "Vidoe removed successfully"))
})

const handleDeletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200).json(new APIResponse(200, {}, "Playlist deleted successfully"))
});

const handleUpdatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, discription } = req.body
    if(!name || !discription){
        return res.status(400).json(new APIError("Fiels are required", 400))
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name,
            discription
        }
    }, { new: true })
    return res.status(200).json(new APIResponse(200, playlist, "Playlist Updated successfully"))
})

module.exports = {
    handleCreatePlaylist,
    handleGetUserPlaylist,
    handleGetPlaylistById,
    handleAddVideoToPlaylist,
    handleRemoveVideoFromPlaylist,
    handleDeletePlaylist,
    handleUpdatePlaylist
}