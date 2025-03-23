const Router = require("express");
const {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleRefreshAccessToken,
  handleGetUserProfileDetails,
  handleGetUserWatchHistory,
  handleChangeUserPassword,
  handleGetCurrentUser,
  handleChangeUserDetails,
  handleUpdatedAvatar,
  handleUpdatedCoverImage,
} = require("../controllers/user.controllers.js");
const multerFileUpload = require("../middlewares/multer.js");
const authMiddleware = require("../middlewares/auth.js");

const router = Router();
// adding middlesware multerFileUpload
router.post(
  "/register",
  multerFileUpload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  handleRegisterUser
);

router.post("/login", handleLoginUser); // Done
router.post("/logout", authMiddleware, handleLogoutUser); // Done
router.post("/newToken", handleRefreshAccessToken); // Done
router.post("/changePassword", authMiddleware, handleChangeUserPassword); // Done
router.get("/getUser", authMiddleware, handleGetCurrentUser); // Done
router.post("/changeDetails", authMiddleware, handleChangeUserDetails); // Done
router.post("/changeAvatar", multerFileUpload.single("avatar"), handleUpdatedAvatar); // Done
router.post("/changeCoverImage", multerFileUpload.single("coverImage"), handleUpdatedCoverImage); // Done
router.get("/getUserProfile/:username", authMiddleware, handleGetUserProfileDetails); // Done
router.get("/WatchHistory", authMiddleware, handleGetUserWatchHistory); // Done
module.exports = router;