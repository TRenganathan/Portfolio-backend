const express = require("express");
const {
  addExperience,
  getAllUserExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const router = express.Router();
router.post("/add/userId/:userId", addExperience);
router.get("/userId/:userId", getAllUserExperience);
router.put("/userId/:userId/experienceId/:experienceId", updateExperience);
router.delete("/userId/:userId/experienceId/:experienceId", deleteExperience);
module.exports = router;
