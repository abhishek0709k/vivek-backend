const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleCreatePlaylist,
  handleGetUserPlaylist,
  handleGetPlaylistById,
  handleAddVideoToPlaylist,
  handleRemoveVideoFromPlaylist,
  handleDeletePlaylist,
  handleUpdatePlaylist
} = require("../controllers/playlist.controllers.js");
const router = Router();

router.post("/createPlaylist", authMiddleware, handleCreatePlaylist); // Done
router.post("/getUserPlaylist/:userId", handleGetUserPlaylist); // Done
router.post("/getPlaylistById/:playlistId", handleGetPlaylistById); // Done
router.post("/addVideoToPlaylist/:playlistId/:videoId", handleAddVideoToPlaylist); // Done
router.post("/removeVideoFromPlaylist/:playlistId/:videoId", handleRemoveVideoFromPlaylist); // Done
router.post("/deletePlaylist/:playlistId", handleDeletePlaylist); // Done
router.post("/updatePlaylist/:playlistId", handleUpdatePlaylist); // Done

module.exports = router;