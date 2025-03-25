const Router = require("express")
const {
    handleGetAllVideos,
    handlePublishVideo,
    handleGetVideoById,
    handleUpdateVideoDetails,
    handleDeleteVideo,
    handleTogglePublishStatus
} = require("../controllers/video.controllers.js")
const multerFileUpload = require("../middlewares/multer.js")
const authMiddleware = require("../middlewares/auth.js")

const router = Router()

router.post("/getAllVideo", handleGetAllVideos) // Done
router.post("/publishVideo", multerFileUpload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), authMiddleware, handlePublishVideo) // Done
router.post("/getVideoById/:videoId", handleGetVideoById) // Done
router.post("/updateVideoDetails/:videoId", multerFileUpload.single("thumbnail"), handleUpdateVideoDetails) // Done
router.post("/deleteVideo/:videoId", handleDeleteVideo) // Done
router.post("/togglePublishStatus/:videoId", handleTogglePublishStatus) // Done

module.exports = router