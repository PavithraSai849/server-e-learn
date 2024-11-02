const cloudinary = require("cloudinary").v2;

// Configure with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload media to Cloudinary
const uploadMediaToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error(error);
          return reject(new Error("Error uploading to Cloudinary"));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Function to delete media from Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete asset from Cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
