import { v2 as cloudinary } from "cloudinary";

const isEnabled = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Uploads a base64 data URL to Cloudinary. If Cloudinary isn't configured,
// the data URL itself is returned and stored in MongoDB (fine for local dev).
export const uploadImage = async (dataUrl) => {
  if (!isEnabled()) return dataUrl;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const res = await cloudinary.uploader.upload(dataUrl, { folder: "quickchat" });
  return res.secure_url;
};
