// controllers/primarySkillController.js

const PrimarySkillSchema = require("../model/PrimarySkillSchema");

// Get primary skills by user ID
exports.getPrimarySkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const primarySkill = await PrimarySkillSchema.findOne({ user: userId });

    if (!primarySkill) {
      return res.status(200).json({ message: "Primary skills not found" });
    }

    res.json(primarySkill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add new primary skills for a user
exports.addOrUpdatePrimarySkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body; // Assume skills is an array of strings
    const updatedPrimarySkill = await PrimarySkillSchema.findOneAndUpdate(
      { user: userId },
      { $set: { skills: skills } },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedPrimarySkill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
