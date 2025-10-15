const express = require('express');
const router = express.Router();
// NOTE: bcrypt is imported but its primary function (compare in /login) is bypassed as requested.
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const Signup = require("../models/Sign"); 
const Course = require('../models/courseModel'); 

const multer = require("multer");
const path = require("path");

// WARNING: Use environment variables (process.env.JWT_SECRET) in production
const JWT_SECRET = "your_jwt_secret_key"; 

// ==========================================================
// --- OTP Temporary Storage (Simulated) ---
// In a real application, OTP and otpExpiresAt fields should be added to the Signup model.
// Using an in-memory Map for demonstration purposes.
const otpStore = new Map(); // Key: email, Value: { otp: string, otpExpiresAt: Date }

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY_MINUTES = 5;

// Function to check if OTP is valid
const isOtpValid = (email, otp) => {
    const data = otpStore.get(email);
    if (!data) return false;

    // Check OTP match and expiry
    return data.otp === otp && new Date() < data.otpExpiresAt;
};
// ==========================================================


// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });
// ----------------------------


// --- Middleware to authenticate JWT ---
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
// -------------------------------------------------------------------


// ==========================================================
// 1. AUTHENTICATION & OTP FLOW
// ==========================================================

// User Registration (Assumes Signup model handles saving password unhashed if hook is removed)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Signup.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // WARNING: This assumes your Mongoose pre-save hook for hashing has been removed.
        const newUser = new Signup({ name, email, password }); 
        await newUser.save(); 

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login (MODIFIED to use PLAIN TEXT comparison as requested)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // --- SECURITY WARNING: USING PLAIN TEXT COMPARISON ---
        // The check below is HIGHLY INSECURE and is done only because it was explicitly requested.
        const isMatch = (password === user.password); 
        // ---------------------------------------------------
        
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        
        const { password: userPassword, ...userData } = user.toObject();

        res.status(200).json({ message: "Login successful", user: userData, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// New API: Send OTP (Used for both OTP Login and Password Reset)
router.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        const otp = generateOtp();
        const expiryDate = new Date(new Date().getTime() + OTP_EXPIRY_MINUTES * 60000);
        
        // Store the OTP data in the in-memory map
        otpStore.set(email, { otp, otpExpiresAt: expiryDate, purpose: 'login_or_reset' });

        // --- SIMULATE EMAIL SENDING ---
        console.log(`[EMAIL SIMULATED] OTP for ${email}: ${otp}. Expires in ${OTP_EXPIRY_MINUTES} mins.`);
        // -----------------------------

        res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// New API: Verify OTP (Used for OTP Login)
router.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        if (!isOtpValid(email, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }
        
        // OTP verified successfully. Clear OTP and generate JWT for login.
        otpStore.delete(email); 
        
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        const { password: userPassword, ...userData } = user.toObject();

        res.status(200).json({ message: "OTP verified. Login successful.", user: userData, token });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// New API: Reset Password (Uses OTP for verification, then updates password)
router.post('/api/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!isOtpValid(email, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }
        
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        // OTP is valid. Proceed with password update.
        user.password = newPassword; 
        await user.save(); 

        // Clear the OTP entry after successful reset
        otpStore.delete(email); 

        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ==========================================================
// 2. PROFILE RETRIEVAL AND UPDATE (Existing logic retained)
// ==========================================================

// GET user by email (Retrieve Profile Data)
router.get('/:email', async (req, res) => {
    try {
        const user = await Signup.findOne({ email: req.params.email })
            .populate('courses.courseId')
            .populate('interestedCourses');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
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

        if (req.file) {
            updateData.profilePic = `/uploads/${req.file.filename}`;
        } else if (req.body.profilePic === 'REMOVE_PIC') {
            updateData.profilePic = null; 
        }
        
        delete updateData.email; 
        delete updateData.password;

        const updatedUser = await Signup.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        ).populate('courses.courseId').populate('interestedCourses');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        const updatedUserObject = updatedUser.toObject();
        delete updatedUserObject.password;

        res.json({ updatedUser: updatedUserObject });
    } catch (err) {
        console.error('Update failed:', err);
        res.status(500).json({ message: 'Update failed' });
    }
});

// 3. CHANGE PASSWORD ROUTE (RETAINED for PLAIN TEXT comparison)
router.put('/change-password/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (newPassword.length < 6) { // Simple validation
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }
        
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // 1. Verify current password using plain text comparison
        const isMatch = (currentPassword === user.password); 
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // 2. Update the password (saving as plain text)
        user.password = newPassword; 
        await user.save(); 

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// ==========================================================
// 4. COURSE ACTIONS (Existing logic retained)
// ==========================================================

// Add Interested Course
router.post('/add-interest', authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await Signup.findById(req.userId); 
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

// Get Interested Courses
router.get('/get-interests', authMiddleware, async (req, res) => {
    try {
        const user = await Signup.findById(req.userId).populate('interestedCourses'); 
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ interestedCourses: user.interestedCourses });
    } catch (error) {
        console.error("Get interests error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
