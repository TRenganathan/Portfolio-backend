// controllers/gridItemController.js

const { User } = require("../model/User");

// Add or update grid items for a user
exports.addOrUpdateGridItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gridItems = items;
    await user.save();

    res
      .status(200)
      .json({
        message: "Grid items updated successfully",
        gridItems: user.gridItems,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all grid items for a specific user
exports.getUserGridItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.gridItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single grid item by ID for a specific user
exports.getGridItemById = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gridItem = user.gridItems.id(itemId);

    if (!gridItem) {
      return res.status(404).json({ message: "Grid item not found" });
    }

    res.status(200).json(gridItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a grid item for a specific user
exports.deleteGridItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gridItems.id(itemId).remove();
    await user.save();

    res.status(200).json({ message: "Grid item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
