const express = require('express');
const upload = require('../utils/multerConfig');


const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {

    if(!req.file){
        res.status(404).json({error : "No file Uploaded"});
        }
    else{
        res.status(202).json({ success: true, message: "File uploaded successfully", file: req.file });
    }

    

})

module.exports = router;