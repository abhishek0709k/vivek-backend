const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleAddComment,
  handleGetVideoComment,
  handleUpdateComment,
  handleDeleteComment,
} = require("../controllers/comment.controllers.js");
const router = Router();

router.post("/addComment/:videoId", authMiddleware, handleAddComment); // Done
router.post("/getVideoComment/:videoId", handleGetVideoComment); // Done
router.post("/updateComment/:commentId", handleUpdateComment); // Done
router.post("/deleteComment/:commentId", handleDeleteComment); // Done

module.exports = router;
