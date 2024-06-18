// routes/gridItems.js
const express = require("express");
const router = express.Router();
const gridItemController = require("../controllers/gridItemController");

router.post("/userId/:userId", gridItemController.addOrUpdateGridItems);
// router.put("/:userId/:id", gridItemController.editGridItem);
router.get("/userId/:userId", gridItemController.getUserGridItems);
router.get("/:userId/:id", gridItemController.getGridItemById);
router.delete("/:userId/:id", gridItemController.deleteGridItem);

module.exports = router;
