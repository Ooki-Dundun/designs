const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    /*folder: "designs",
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        console.log("hello je suis là");
        cb(null, file.originalname)
    }*/
    params: async (req, file) => {
        // async code using `req` and `file`
        // ...
        console.log("hey hey");
        console.log(file);
        return {
          folder: 'folder_name',
          format: 'jpeg',
          //public_id: 'some_unique_id',
        };
      }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;