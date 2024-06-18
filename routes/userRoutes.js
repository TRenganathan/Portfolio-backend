const express = require("express");
const {
  addUsers,
  signInUser,
  addPassword,
  getAllUsers,
} = require("../controllers/user-controller");

const router = express.Router();
router.get("/", getAllUsers);
router.post("/add", addUsers);
router.post("/login", signInUser);
router.post("/addpassword", addPassword);
module.exports = router;
