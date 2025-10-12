// models/courseModel.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  modules: {
    english: [videoSchema],
    tamil: [videoSchema],
    telugu: [videoSchema],
    hindi: [videoSchema],
    kannada: [videoSchema]
  }
});

// Fix OverwriteModelError
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
