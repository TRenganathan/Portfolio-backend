// models/PrimarySkill.js
const mongoose = require("mongoose");

const PrimarySkillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PrimarySkill", PrimarySkillSchema);
