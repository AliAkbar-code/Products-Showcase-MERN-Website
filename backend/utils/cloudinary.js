const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuration
// You will need to put these to .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, folder = 'product_showcase') => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  // Extrat public_id from imageUrl
  // Example: 'https://res.cloudinary.com/dvxxx/image/upload/v12345/product_showcase/xyz123.jpg'
  // public_id would be 'product_showcase/xyz123'
  try {
    const urlParts = imageUrl.split('/');
    const fileWithExtension = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const fileName = fileWithExtension.split('.')[0];
    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete image from cloudinary', err);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
