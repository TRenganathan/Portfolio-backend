const express = require("express");
const {
  getProjects,
  addProject,
  editProject,
  deleteProject,
} = require("../controllers/projectController");
const router = express.Router();

router.get("/userId/:userId", getProjects);
router.post("/add/userId/:userId", addProject);
router.put("/userId/:userId/projectId/:projectId", editProject);
router.delete("/userId/:userId/projectId/:projectId", deleteProject);

module.exports = router;
