const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  projectImage: {
    type: [String],
  },
  projectURL: {
    type: String,
  },
  languagesUsed: {
    type: [String],
  },
});
const Project = mongoose.model("Project", projectSchema);
exports.Project = Project;
