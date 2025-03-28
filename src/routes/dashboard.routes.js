const Router = require("express");
const authMiddleware = require("../middlewares/auth.js");
const {
  handleGetAllVideosByUserId,
  handleGetAllViews,
  handleGetAllSubscribers,
} = require("../controllers/dashboard.controllers.js");
const router = Router();

router.post("/getAllVideos", authMiddleware, handleGetAllVideosByUserId);
router.post("/getAllViews", authMiddleware, handleGetAllViews);
router.post("/getAllSubscribers", authMiddleware, handleGetAllSubscribers);

module.exports = router