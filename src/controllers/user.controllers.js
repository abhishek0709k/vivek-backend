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

  const ExistedUser = await User.findOne({ email });
  if (ExistedUser) {
     return res.status(404).json(new APIError("User already exist" , 404))
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    return res.status(400).json(new APIError("Avatar file is required" , 400))
  }

  const cloudinaryAvatarFile = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryCoverImageFile = await uploadOnCloudinary(coverImageLocalPath);
  
  if (!cloudinaryAvatarFile)
    return res.status(400).json(new APIError("Avatar file is required" , 400))

  const newUser = await User.create({
    username,
    fullname,
    email,
    password,
    avatar: cloudinaryAvatarFile.url,
    coverImage: cloudinaryCoverImageFile?.url || "",
  });
  if(!newUser) return res.status(400).json(new APIError("User not created" , 400))
  const createdUser = await User.findById(newUser.id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    return res.status(400).json(new APIError("Something went wrong while registering the file" , 500))
  return res.status(200).json(new APIResponse(201 , createdUser , "User created Successfully"))
});

const handleLoginUser = asyncHandler( async (req , res)=>{
  const { email , password } = req.body;
  if(!email|| !password) return res.status(400).json(new APIError("All fields are required" , 400));

  const dbUser = await User.findOne({ email });
  if(!dbUser) return res.status(400).json(new APIError("User not found. Please Sign up" , 400));

  const comparingPassword = await dbUser.isCorrectPassword(password)
  if(!comparingPassword){
    return res.status(400).json(new APIError("Password is incorrect" , 400));
  }

  const AccessToken = await dbUser.generateAccessToken();
  const RefreshToken = await dbUser.generateRefreshToken();

  dbUser.refreshToken = RefreshToken;

  await dbUser.save({ validateBeforeSave : false })

  const options = {
    httpOnly : true,
    secure : true
  }
  res.status(200)
  .cookie("Access_Token" , AccessToken , options)
  .cookie("Refresh_Token" , RefreshToken , options)
  .json("logged In")
})

const handleLogoutUser = asyncHandler( async (req , res)=>{
  const user = await User.findByIdAndUpdate(req.user._id , {
    $set : {
      refreshToken : undefined
    }
  })
  const options = {
    httpOnly : true,
    secure : true
  }
  res.status(200)
  .clearCookie("Access_Token" , options)
  .clearCookie("Refresh_Token" , options)
  .json(new APIResponse(200 , {} , "Logout successfully"))
})

module.exports = { handleRegisterUser , handleLoginUser , handleLogoutUser };