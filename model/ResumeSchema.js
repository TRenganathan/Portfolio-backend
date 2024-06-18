const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String,
  },
});
const Resume = mongoose.model("Resume", resumeSchema);
exports.Resume = Resume;
