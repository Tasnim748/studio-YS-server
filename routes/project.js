var express = require('express');
var router = express.Router();
var { Project } = require('../models/model');
var multer = require('multer');
var deleteFile = require('../utils/delFile');
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
  limits:{fileSize: 100000000}, // Limit file size to 100MB
}).single('vid');

router.get('/', async (req, res) => {
    const projects = await Project.find();
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
                const vidUrl = 'https' + '://' + req.get('host') + `/videos/${req.file.filename}`;
                data.videoLink = vidUrl;
                let newProj = new Project(data);
                const savedInst = await newProj.save();
                console.log(savedInst);
                return res.json({vidUrl: vidUrl, message: 'received', data: savedInst});
            }
        }
    });
})


router.delete('/', async (req, res) => {
    console.log(req.body._id);
    try {
        let toBeDeleted = await Project.findById(req.body._id);
        console.log(toBeDeleted);

        await Project.findByIdAndDelete(req.body._id);
        console.log('deleted');

        const url = toBeDeleted.videoLink;
        const filename = url.substring(url.lastIndexOf('/') + 1);
        console.log(filename);
        deleteFile(filename, res, "videos")
        return res.json({message: 'deletion received', status: 204});
    } catch(e) {
        console.log('some wrong')
        return res.status(500).send('deletion error!');
    }
})

router.put('/', async (req, res) => {
    let _id = req.body._id;
    console.log("before", req.body);
    let toBeUpdated = delete req.body._id;
    console.log("after", req.body);
    console.log(toBeUpdated);
    if (toBeUpdated) {
        await Project.findByIdAndUpdate(_id, req.body);
        let newThing = await Project.findById(_id);
        console.log(newThing);
        return res.json({message: 'update success', data: newThing});
    }
    return res.json({message: 'not found', status: 404});
})

module.exports = router;