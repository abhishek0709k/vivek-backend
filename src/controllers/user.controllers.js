const asyncHandler = require("../utils/asyncHandler.js");
const APIError = require("../utils/apiError.js");
const User = require("../models/user.models.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const APIResponse = require("../utils/apiResponse.js");
const jwt = require("jsonwebtoken");

const handleRegisterUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some((field) => field.trim() === "")
  ) {
    throw new APIError("All fields are required", 400);
  }

  const ExistedUser = await User.findOne({ email });
  if (ExistedUser) {
    return res.status(404).json(new APIError("User already exist", 404));
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    return res.status(400).json(new APIError("Avatar file is required", 400));
  }

  const cloudinaryAvatarFile = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryCoverImageFile = await uploadOnCloudinary(
    coverImageLocalPath
  );

  if (!cloudinaryAvatarFile)
    return res.status(400).json(new APIError("Avatar file is required", 400));

  const newUser = await User.create({
    username,
    fullname,
    email,
    password,
    avatar: cloudinaryAvatarFile.url,
    coverImage: cloudinaryCoverImageFile?.url || "",
  });
  if (!newUser)
    return res.status(400).json(new APIError("User not created", 400));
  const createdUser = await User.findById(newUser.id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    return res
      .status(400)
      .json(
        new APIError("Something went wrong while registering the file", 500)
      );
  return res
    .status(200)
    .json(new APIResponse(201, createdUser, "User created Successfully"));
});

const handleLoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(new APIError("All fields are required", 400));

  const dbUser = await User.findOne({ email });
  if (!dbUser)
    return res
      .status(400)
      .json(new APIError("User not found. Please Sign up", 400));

  const comparingPassword = await dbUser.isCorrectPassword(password);
  if (!comparingPassword) {
    return res.status(400).json(new APIError("Password is incorrect", 400));
  }

  const AccessToken = await dbUser.generateAccessToken();
  const RefreshToken = await dbUser.generateRefreshToken();

  dbUser.refreshToken = RefreshToken;

  await dbUser.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("Access_Token", AccessToken, options)
    .cookie("Refresh_Token", RefreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          "Access Token": AccessToken,
          "Refresh Token": RefreshToken,
        },
        "User Logged In successfully"
      )
    );
});

const handleLogoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("Access_Token", options)
    .clearCookie("Refresh_Token", options)
    .json(new APIResponse(200, {}, "Logout successfully"));
});

const handleRefreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.Refresh_Token || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res
      .status(400)
      .json(new APIError("You are logged Out. Token is required.", 400));
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id);

  if (!user) {
    return res.status(400).json(new APIError("User not found", 400));
  }

  const existedRefreshToken = await user.refreshToken;

  if (incomingRefreshToken !== existedRefreshToken) {
    return res.status(400).json(new APIError("Invalid refresh Token", 400));
  }

  const newAccessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("Access_Token", newAccessToken, options)
    .cookie("Refresh_Token", newRefreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          "Access Token": newAccessToken,
          "Refresh Token": newRefreshToken,
        },
        "Access Token created successfully"
      )
    );
});

const handleChangeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const checkingPassword = await user.isCorrectPassword(oldPassword);
  if (!checkingPassword) {
    return res.status(400).json(new APIError("Password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { "New Password": newPassword },
        "Password changed Successfully"
      )
    );
});

const handleGetCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new APIResponse(200, req.user, "Current User"));
});

const handleChangeUserDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if(!fullname || !email) {
    return res.status(400).json(new APIError("Details are required for Update" , 400))
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new APIResponse(200 , user , "Details Updated Successfully"))
});

const handleUpdatedAvatar = asyncHandler( async (req , res)=>{
  const avatarFilePath = req.file?.path

  const avatarFileData =  await uploadOnCloudinary(avatarFilePath);

  const accessToken = req.cookies?.Access_Token || req.body?.AccessToken;
  const decodedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)
  const user = await User.findById(decodedToken._id).select("-password")

  user.avatar = avatarFileData.url;
  await user.save({ validateBeforeSave : false })

  return res.status(200)
    .json(new APIResponse(200 , user , "Avatar Image updated Successfully"))
})

const handleUpdatedCoverImage = asyncHandler( async (req , res)=>{
  const coverImageFilePath = req.file?.path;
  const coverImageFileData = await uploadOnCloudinary(coverImageFilePath);

  const accessToken = req.cookies?.Access_Token || req.body?.AccessToken;
  const decodedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)
  const user = await User.findById(decodedToken._id).select("-password")

  user.coverImage = coverImageFileData.url;
  await user.save({ validateBeforeSave : false });

  return res.status(200).json(new APIResponse(200 , user , "Cover Image updated Successfully "))
})

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleRefreshAccessToken,
  handleChangeUserPassword,
  handleGetCurrentUser,
  handleChangeUserDetails,
  handleUpdatedAvatar,
};