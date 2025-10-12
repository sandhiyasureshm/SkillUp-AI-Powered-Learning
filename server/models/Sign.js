const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    
    // --- NEW FIELDS ADDED HERE ---
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    
    // New fields from the profile page
    dob: { type: Date, default: null },       // Use Date type for Date of Birth
    occupation: { type: String, default: "" },
    education: { type: String, default: "" },
    // -----------------------------
    
    courses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
            status: { type: String, enum: ['interested', 'in-progress', 'completed'], default: 'interested' },
            startedAt: { type: Date },
            completedAt: { type: Date }
        }
    ],
    interestedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

// Fix OverwriteModelError
module.exports = mongoose.models.reg || mongoose.model('reg', signupSchema);
