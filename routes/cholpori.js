var express = require("express");
var router = express.Router();
var { CholporiWords } = require("../models/model");

router.get("/", async (req, res) => {
    const cholporiWords = await CholporiWords.find();
    return res.json(cholporiWords);
});

router.post("/", async (req, res) => {
    let data = req.body;
    console.log(data);
    let newThing = new CholporiWords(data);
    const savedInst = await newThing.save();
    console.log(savedInst);
    return res.json({ message: "received", data: savedInst });
});

router.put('/:_id', async (req, res) => {
    let _id = req.params["_id"];
    console.log("_id", _id);
    let toBeUpdated = req.body;
    console.log("body", toBeUpdated);

    if (toBeUpdated) {
        await CholporiWords.findByIdAndUpdate(_id, req.body);
        let newThing = await CholporiWords.findById(_id);
        console.log(newThing);
        return res.json({message: 'update success', data: newThing});
    }
    return res.json({message: 'not found', status: 404});
});

router.delete('/:id', async(req, res) => {
    let _id = req.params['id'];
    console.log(_id);
    await CholporiWords.findByIdAndDelete(_id);
    return res.json({'message': 'deletion processed'})
})

module.exports = router