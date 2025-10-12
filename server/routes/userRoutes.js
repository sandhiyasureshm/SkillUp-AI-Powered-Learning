const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Model Imports (Adjusted based on your usage) ---
// Since you are using "Signup" for profile updates, we'll use it consistently
const Signup = require("../models/Sign"); 
const Course = require('../models/courseModel'); // Assuming this exists
// Note: User and Users models were present but seem superseded by Signup for profile/auth in your flow.
// We'll keep the variable names but rely on Signup if that's your active model.
const User = Signup; 
// ----------------------------------------------------

const multer = require("multer");
const path = require("path");

// WARNING: Use environment variables (process.env.JWT_SECRET) in production
const JWT_SECRET = "your_jwt_secret_key"; 

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });
// ----------------------------


// --- Middleware to authenticate JWT (Keeping your existing logic) ---
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // WARNING: If you use Signup for Auth, ensure your token stores the ID of the Signup document.
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
// -------------------------------------------------------------------


// ==========================================================
// 1. AUTHENTICATION (Using Signup Model)
// ==========================================================

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Signup.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Password hashing is typically handled by a pre-save hook in your Signup model (sign.js)
        const newUser = new Signup({ name, email, password });
        await newUser.save(); // The pre-save hook should hash the password here

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token using the correct user ID
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        
        // Exclude the password hash when sending user data back
        const { password: userPassword, ...userData } = user.toObject();

        res.status(200).json({ message: "Login successful", user: userData, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ==========================================================
// 2. PROFILE RETRIEVAL AND UPDATE
// ==========================================================

// GET user by email (Retrieve Profile Data)
router.get('/:email', async (req, res) => {
    try {
        // Use Signup model as established
        const user = await Signup.findOne({ email: req.params.email })
            .populate('courses.courseId')
            .populate('interestedCourses');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Exclude password for security
        const userObject = user.toObject();
        delete userObject.password; 
        
        res.json(userObject);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE user profile
router.put('/:email', upload.single('profilePic'), async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = { ...req.body };

        // --- Image Handling Logic ---
        if (req.file) {
            // New file uploaded
            // NOTE: Ensure your front-end path or server setup correctly handles the image URL
            updateData.profilePic = `/uploads/${req.file.filename}`;
        } else if (req.body.profilePic === 'REMOVE_PIC') {
            // Client sent signal to remove the image
            updateData.profilePic = null; 
            // NOTE: In a real app, delete the old image file from the disk here.
        }
        // If req.file is null and req.body.profilePic is NOT 'REMOVE_PIC', 
        // profilePic is not in updateData, and thus remains unchanged.
        // --- End Image Handling Logic ---

        // Ensure we don't accidentally override the email or password
        delete updateData.email; 
        delete updateData.password;

        const updatedUser = await Signup.findOneAndUpdate(
            { email },
            updateData,
            // { new: true, runValidators: true } <-- Added runValidators for new schema fields (dob, occupation, etc.)
            { new: true, runValidators: true }
        ).populate('courses.courseId').populate('interestedCourses');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        // Exclude password hash before responding
        const updatedUserObject = updatedUser.toObject();
        delete updatedUserObject.password;

        res.json({ updatedUser: updatedUserObject });
    } catch (err) {
        console.error('Update failed:', err);
        res.status(500).json({ message: 'Update failed' });
    }
});

// 3. CHANGE PASSWORD ROUTE (NO HASHING)
router.put('/change-password/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { currentPassword, newPassword } = req.body;

        // ... (length check) ...
        
        const user = await Signup.findOne({ email });
        // ... (user check) ...

        // 1. Verify current password using plain text comparison
        const isMatch = (currentPassword === user.password); // <-- Plain string comparison
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // 2. Update the password (saving as plain text)
        user.password = newPassword; 
        await user.save(); 

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        // ...
    }
});

// ==========================================================
// 4. COURSE ACTIONS (Using existing logic/middleware)
// ==========================================================

// Add Interested Course (Keeping your existing logic but ensuring User maps to Signup)
router.post('/add-interest', authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await Signup.findById(req.userId); // Use Signup model
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.interestedCourses.includes(courseId)) {
            user.interestedCourses.push(courseId);
            await user.save();
            res.status(200).json({ message: "Course added to interested list" });
        } else {
            res.status(409).json({ message: "Course already in interested list" });
        }
    } catch (error) {
        console.error("Add interest error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Interested Courses (Keeping your existing logic but ensuring User maps to Signup)
router.get('/get-interests', authMiddleware, async (req, res) => {
    try {
        const user = await Signup.findById(req.userId).populate('interestedCourses'); // Use Signup model
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ interestedCourses: user.interestedCourses });
    } catch (error) {
        console.error("Get interests error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;