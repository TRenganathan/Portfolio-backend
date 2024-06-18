const mongoose = require("mongoose");
const FooterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
  },
  copyRight: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  naukuri: {
    type: String,
  },
  github: {
    type: String,
  },
  twitter: {
    type: String,
  },
});
const Footer = mongoose.model("Footer", FooterSchema);
exports.Footer = Footer;
