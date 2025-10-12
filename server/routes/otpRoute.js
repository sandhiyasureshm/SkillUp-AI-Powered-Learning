const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

let otpStore = {};

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Skill Up Login',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });

  if (otpStore[email].toString() !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email];
  res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = router;
