const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  link: String
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
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
