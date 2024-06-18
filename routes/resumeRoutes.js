const express = require("express");
const { updateResume, getResume } = require("../controllers/resumeController");
const router = express.Router();
router.put("/userId/:userId", updateResume);
router.get("/userId/:userId", getResume);
module.exports = router;
