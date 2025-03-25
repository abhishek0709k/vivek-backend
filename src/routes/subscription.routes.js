const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleToggleSubscription,
} = require("../controllers/subscription.controllers.js");
const router = Router();

router.post("/togglePublishStatus/:channelId", authMiddleware, handleToggleSubscription);

module.exports = router;