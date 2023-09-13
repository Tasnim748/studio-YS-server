var express = require('express');
var router = express.Router();
var { Project } = require('../models/model');
var multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/videos/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000000}, // Limit file size to 1MB
}).single('vid');

router.get('/', async (req, res) => {
    const projects = await Project.find();
    // console.log(projects)
    return res.json(projects);
});

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(1);
            return res.json({message: 'An error occurred while uploading the file.'});
        } else {
            if (req.file == undefined) {
                console.log(2);
                return res.send({message: 'No file selected.'});
            } else {
                let data = req.body;
                const vidUrl = req.protocol + '://' + req.get('host') + `/videos/${req.file.filename}`;
                data.videoLink = vidUrl;
                let newProj = new Project(data);
                await newProj.save();
                return res.json({vidUrl: vidUrl, message: 'received'});
            }
        }
    });
})

module.exports = router;