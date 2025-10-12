const express = require('express');
const router = express.Router();
const Signup = require('../models/Sign');

// In-memory OTP store (for simplicity)
const otpStore = {};

// 1. Send OTP for password reset
router.post('/send-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5 min expiry
        otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        // TODO: Send OTP via email
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await Signup.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const storedOtp = otpStore[email];
        if (!storedOtp) return res.status(400).json({ message: 'No OTP sent for this email' });
        if (storedOtp.expires < Date.now()) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP expired' });
        }
        if (storedOtp.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        user.password = newPassword;
        await user.save();
        delete otpStore[email];

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
