const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return { Message: "local file is required" };
    const cloudinaryFileData = await cloudinary.uploader.upload(localFilePath, {
      public_id: `${localFilePath.toString().slice(-6)}`,
      resource_type: "auto",
    });
    // fs.unlinkSync(localFilePath);
    return cloudinaryFileData;
  } catch (error) {
    console.log("Error in File upload", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = uploadOnCloudinary;
