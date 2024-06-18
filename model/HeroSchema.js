const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const heroSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tagLine: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});
const Hero = mongoose.model("Hero", heroSchema);
exports.Hero = Hero;
