const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
  address: String,
  education: {
    qualification: String,
    institution: String,
    year: String,
    cgpa: String,
  },
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      description: String,
    },
  ],
  skills: [String],
  achievements: [String],
  profilePic: String,
});

module.exports = mongoose.model("Users", userSchema);
