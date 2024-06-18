// routes/profile.js
const express = require("express");
const multer = require("multer");
const Profile = require("../model/profileSchema");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const upload = multer({ dest: "uploads/profile_pictures/" });

const router = express.Router();

router.put("/userId/:userId", updateProfile);
router.get("/userId/:userId", getProfile);

module.exports = router;
