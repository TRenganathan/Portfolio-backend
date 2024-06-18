const mongoose = require("mongoose");
const ExperienceSchema = new mongoose.Schema({
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
  },
  companyName: {
    type: String,
  },
  duration: {
    type: String,
  },
  location: {
    type: String,
  },
});
const Experience = mongoose.model("Experience", ExperienceSchema);
exports.Experience = Experience;
