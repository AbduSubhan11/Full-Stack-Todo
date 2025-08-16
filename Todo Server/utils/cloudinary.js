import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "default_cloud_name",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});


export const uploadImageToCloudinary = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    fs.unlinkSync(path);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    fs.unlinkSync(path);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
