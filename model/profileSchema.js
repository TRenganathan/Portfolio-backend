const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profilePicture: {
    type: String,
    required: false, // This can be optional as the user might not upload it initially
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false, // This can be optional as the user might not provide it initially
  },
  role: {
    type: String,
    required: true,
  },
  totalProjects: {
    type: String,
    required: false, // This can be optional, and you can calculate it dynamically if needed
  },
  totalExperience: {
    type: String, // Assuming this is in years
    required: false, // This can be optional
  },
  currentCTC: {
    type: String, // Assuming this is in the same unit as expectedCTC
    required: false, // This can be optional
  },
  expectedCTC: {
    type: String, // Assuming this is in the same unit as currentCTC
    required: false, // This can be optional
  },
  resume: {
    type: String, // Assuming this is a URL or path to the resume file
    required: false, // This can be optional as the user might not upload it initially
  },
  myInfo: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
