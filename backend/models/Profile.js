const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: String,
  dateOfBirth: String,
  about: String,
  contactNumber: String,
});

module.exports = mongoose.model("Profile", profileSchema);
