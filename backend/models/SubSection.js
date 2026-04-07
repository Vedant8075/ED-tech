const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: String,

  description: String,

  videoUrl: String,

  timeDuration: String,
});

module.exports = mongoose.model("SubSection", subSectionSchema);
