const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "../../public");
  },
  filename: function (req, file, cd) {
    cd(null, file.fieldname + "-" + Date.now());
  },
});

const multerFileUpload = multer({ storage: storage });

module.exports = multerFileUpload;
