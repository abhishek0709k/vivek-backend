const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleCreateTweet,
  handleGetUserTweets,
  handleUpdateTweet,
  handleDeleteTweet,
} = require("../controllers/tweet.controllers.js");
const router = Router();

router.post("/createTweet", authMiddleware, handleCreateTweet); // Done
router.post("/getUserTweet/:userId", handleGetUserTweets); // Done
router.post("/updateTweet/:tweetId", handleUpdateTweet); // Done
router.post("/deleteTweet/:tweetId", handleDeleteTweet); // Done

module.exports = router;