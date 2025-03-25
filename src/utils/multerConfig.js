const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : path.join(__dirname, "..", process.env.UPLOADS_DIR),
    filename : ((req, file, callBack) => {
        callBack(null, `${Date.now()}--${file.originalname}`);
        
    }),

})

const upload = multer({storage});
module.exports = upload;