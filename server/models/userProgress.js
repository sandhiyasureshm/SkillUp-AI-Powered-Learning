// C:\Users\dell\OneDrive\Desktop\Login-Register\server\models\userProgress.js

const mongoose = require('mongoose'); // <--- ADD THIS LINE

const userProgressSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Signup', 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    
    // Schema looks correct for storing an array of strings (video links)
    completedVideos: [{ type: String }], 
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress; // <--- Ensure you are exporting the model