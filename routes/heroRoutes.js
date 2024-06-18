const express = require("express");
const {
  addHeroContent,
  getHeroContent,
} = require("../controllers/heroController");
const { verifyToken } = require("../controllers/user-controller");
const router = express.Router();

router.post("/add/userId/:userId", verifyToken, addHeroContent);
router.get("/userId/:userId", getHeroContent);
module.exports = router;
