// routes/primarySkillRoutes.js
const express = require("express");
const router = express.Router();
const primarySkillController = require("../controllers/primarySkillController");

router.get("/userId/:userId", primarySkillController.getPrimarySkills);
router.post("/userId/:userId", primarySkillController.addOrUpdatePrimarySkills);

module.exports = router;
