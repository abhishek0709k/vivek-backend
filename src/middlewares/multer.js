const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname , "../../public"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const basename = path.basename(file.originalname , ext)
    cb(null, `${basename}_${Date.now()}${ext}`);
  },
});

const multerFileUpload = multer({ storage });

module.exports = multerFileUpload;
