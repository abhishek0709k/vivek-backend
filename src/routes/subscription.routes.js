const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleToggleSubscription,
  handleCreateSubscription,
  handleGetUserChannelSubscribers,
  handleGetSubscribedChannels
} = require("../controllers/subscription.controllers.js");
const router = Router();

router.post("/togglePublishStatus/:channelId", authMiddleware, handleToggleSubscription); // Done
router.post("/createSubscription/:channelId", handleCreateSubscription); // Done
router.post("/getChannelSubscribers/:channelId", handleGetUserChannelSubscribers);
router.post("/getSubscribedChannels/:channelId", handleGetSubscribedChannels)

module.exports = router;