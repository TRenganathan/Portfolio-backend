const express = require("express");
const {
  addOrUpdateFooter,
  getFooter,
} = require("../controllers/footerController");
const router = express.Router();
router.post("/add/userId/:userId", addOrUpdateFooter);
router.get("/userId/:userId", getFooter);
module.exports = router;
