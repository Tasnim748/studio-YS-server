var express = require('express');
var router = express.Router();
var { News } = require('../models/model');
var multer = require('multer');
var deleteFile = require('../utils/delFile');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000}, // Limit file size to 10MB
}).single('nwimg');

router.get('/', async (req, res) => {
    const news = await News.find();
    return res.json(news);
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
                const imgUrl = 'https' + '://' + req.get('host') + `/images/${req.file.filename}`;
                data.thumbnailLink = imgUrl;
                let newNews = new News(data);
                const savedInst = await newNews.save();
                console.log(savedInst);
                return res.json({imgUrl: imgUrl, message: 'received', data: savedInst});
            }
        }
    });
})

router.delete('/', async (req, res) => {
    console.log(req.body._id);
    try {
        let toBeDeleted = await News.findById(req.body._id);
        console.log(toBeDeleted);

        await News.findByIdAndDelete(req.body._id);
        console.log('deleted');

        const url = toBeDeleted.thumbnailLink;
        const filename = url.substring(url.lastIndexOf('/') + 1);
        console.log(filename);
        deleteFile(filename, res, "images")
        return res.json({message: 'deletion received', status: 204});
    } catch(e) {
        console.log('some wrong')
        return res.status(500).send('deletion error!');
    }
})

router.put('/', async (req, res) => {
    return
})

module.exports = router;