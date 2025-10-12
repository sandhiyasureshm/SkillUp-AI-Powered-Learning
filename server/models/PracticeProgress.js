const mongoose = require('mongoose');

const PracticeProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // store user._id as string (or ObjectId if you prefer)
  interviewsCompleted: { type: Number, default: 0 },
  codingSolved: { type: Number, default: 0 },
  quizzesAttempted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PracticeProgress', PracticeProgressSchema);
