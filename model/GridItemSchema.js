// models/GridItem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GridItemSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  className: { type: String, required: true },
  imgClassName: { type: String, default: "" },
  titleClassName: { type: String, default: "" },
  img: { type: String, default: "" },
  spareImg: { type: String, default: "" },
  email: { type: String, default: "" },
});

module.exports = GridItemSchema;
