const mongoose = require('mongoose');

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

module.exports.Project = Project;
module.exports.Team = Team;