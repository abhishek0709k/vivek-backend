const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const User = require("../models/user.models.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const APIResponse = require("../utils/apiResponse.js");

const handleRegisterUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some((field) => field.trim() === "")
  ) {
    throw new APIError("All fields are required", 400);
  }

  const ExistedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (ExistedUser) {
    throw new APIError("User Already Exist", 400);
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) {
    throw new APIError("Avatar image is required", 406);
  }

  const cloudinaryAvatarFile = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryCoverImageFile = await uploadOnCloudinary(coverImageLocalPath);

  if (!cloudinaryAvatarFile)
    throw new APIError("Avatar image is required", 400);

  const newUser = await User.create({
    username,
    fullname,
    email,
    password,
    avatar: cloudinaryAvatarFile.url,
    coverImage: cloudinaryCoverImageFile?.url || "",
  });
  const createdUser = await User.findById(newUser.id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new APIError("Something went wrong while registering the User", 500);
  return new APIResponse(200, createdUser);
});

module.exports = { handleRegisterUser };