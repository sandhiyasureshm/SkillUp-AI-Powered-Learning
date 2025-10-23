require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Signup = require('./models/Sign'); // User model

// ----------------------
// Initialize App
// ----------------------
const app = express();

// ----------------------
// CORS Configuration (Render + Netlify + Vercel + Local)
// ----------------------
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'https://skill-up-ai-powered-learning.vercel.app', // Vercel
  'https://remarkable-scone-1e24b6.netlify.app', // Netlify frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file handling
app.use("/uploads", express.static("uploads"));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ----------------------
// Route Imports
// ----------------------
const codingRoutes = require("./routes/codingRoutes"); 
const mockInterviewRoutes = require("./routes/mockInterviewRoutes");
const userRoutes = require("./routes/userRoutes");
const otpRoute = require("./routes/otpRoute");
const examRoutes = require("./routes/exam");
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

// ----------------------
// Use Routes
// ----------------------
app.use('/api', require('./routes/gemini')); 
app.use('/api/practice', require('./routes/practice'));
app.use('/api/dropdowns', require('./routes/dropdowns'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/coding', codingRoutes);
app.use('/api/mock', mockInterviewRoutes);
app.use('/api/users', userRoutes);
app.use("/api", otpRoute);
app.use("/api/exams", examRoutes);
app.use('/api', forgotPasswordRoutes);

// ----------------------
// Root Test Route
// ----------------------
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect(
  process.env.MONGO_URI || "mongodb+srv://sandhiyasuresh:suresh321@cluster0.cii3c.mongodb.net/AI_Mock"
)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------------
// User Authentication Routes
// ----------------------
app.post('/reg', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) 
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await Signup.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: "Email already exists" });

    const newUser = new Signup({ name, email, password, interestedCourses: [] });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: "Email and password are required" });

    const user = await Signup.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Login failed: User does not exist" });

    if (user.password !== password) 
      return res.status(400).json({ message: "Login failed: Incorrect password" });

    const userPayload = {
      _id: user._id,
      email: user.email,
      name: user.name || user.username || 'User'
    };

    res.status(200).json({ message: "Login successful", user: userPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ----------------------
// Course Interest Routes
// ----------------------
app.post('/add-interest', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) 
      return res.status(400).json({ message: "User ID and Course ID are required" });

    const user = await Signup.findById(userId);
    if (!user) 
      return res.status(404).json({ message: "User not found" });

    if (!user.interestedCourses.includes(courseId)) {
      user.interestedCourses.push(courseId);
      await user.save();
      return res.status(200).json({ message: "Course added to interested list" });
    }
    res.status(409).json({ message: "Course already in interested list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/get-interests/:userId', async (req, res) => {
  try {
    const user = await Signup.findById(req.params.userId).populate('interestedCourses');
    if (!user) 
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ interestedCourses: user.interestedCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/remove-interest', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) 
      return res.status(400).json({ message: "User ID and Course ID are required" });

    const user = await Signup.findById(userId);
    if (!user) 
      return res.status(404).json({ message: "User not found" });

    user.interestedCourses = user.interestedCourses.filter(c => c.toString() !== courseId);
    await user.save();
    res.status(200).json({ message: "Course removed from interested list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
