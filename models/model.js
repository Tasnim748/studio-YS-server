const mongoose = require('mongoose');




// for yellowsomething
const projectSchema = new mongoose.Schema({
    title: String,
    videoLink: String,
    description: String,
    category: String
});
const Project = mongoose.model('Project', projectSchema);

const teamSchema = new mongoose.Schema({
    name: String,
    bio: String,
    designation: String,
    picLink: String
});
const Team = mongoose.model('Team', teamSchema);

const newsSchema = new mongoose.Schema({
    category: String,
    title: String,
    description: String,
    link: String,
    thumbnailLink: String
});
const News = mongoose.model('News', newsSchema);

module.exports.Project = Project;
module.exports.Team = Team;
module.exports.News = News;




// for cholpori
const cholporiWordsSchema = new mongoose.Schema({
    name: String,
    type: String
})
const CholporiWords = mongoose.model('CholporiWords', newsSchema);

module.exports.CholporiWords = CholporiWords;