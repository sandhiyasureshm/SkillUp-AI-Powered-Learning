require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Signup = require('./models/Sign'); // Assuming your user model is here

// ----------------------
// Route Imports
// ----------------------
const codingRoutes = require("./routes/codingRoutes"); 
const mockInterviewRoutes = require("./routes/mockInterviewRoutes"); // Correct Import
const userRoutes = require("./routes/userRoutes");
const otpRoute = require("./routes/otpRoute");
const app = express();

// ----------------------
// CORS Configuration (The constant solution)
// ----------------------

const allowedOrigins = [
    'http://localhost:5173', // Must be HTTP for local development
    'https://skill-up-ai-powered-learning.vercel.app', // Your primary Vercel domain
];

const corsOptions = {
    // 🎯 Use a function to dynamically allow Vercel preview domains
    origin: (origin, callback) => {
        // 1. Allow if the origin is in the explicitly approved list (localhost or main domain)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } 
        // 2. Allow if the origin is a Vercel preview domain (ends with .vercel.app)
        else if (origin && /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        }
        // 3. Allow requests with no origin (like mobile apps, testing tools, or direct server access)
        else if (!origin) {
             callback(null, true);
        }
        // 4. Block all others
        else {
            console.log(`CORS Policy: Blocking request from origin ${origin}`);
            callback(new Error(`Not allowed by CORS: ${origin}`), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};

const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
app.use('/api', forgotPasswordRoutes);

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));


// ----------------------
// Middlewares
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added urlencoded middleware for robust forms
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ----------------------
// Routes
// ----------------------
app.use('/api', require('./routes/gemini')); 
app.use('/api/practice', require('./routes/practice'));
app.use('/api/dropdowns', require('./routes/dropdowns'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/api/jobs', require('./routes/jobs'));

// AI Practice Routes
// Coding routes will be accessed via: https://skillup-ai-powered-learning-1.onrender.com/api/coding/...
app.use('/api/coding', codingRoutes); 

// Mock Interview routes will be accessed via: https://skillup-ai-powered-learning-1.onrender.com/api/mock/generate-interview
// This replaces the incorrect lines you had commented out.
app.use('/api/mock', mockInterviewRoutes); 
app.use('/api/users', userRoutes);
app.use("/api", otpRoute);


// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/AI_Mock", {
    // These options are often unnecessary in newer Mongoose versions but don't hurt
    // useNewUrlParser: true, 
    // useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// ----------------------
// User Authentication & Interests (No changes needed)
// ----------------------
app.post('/reg', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const existingUser = await Signup.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

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
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        // 1. Fetch user (ensure 'name' is being fetched)
        const user = await Signup.findOne({ email });
        
        if (!user) return res.status(400).json({ message: "Login failed: User does not exist" });
        
        // **CRITICAL NOTE:** Storing plain passwords like this is highly insecure. 
        // Always use bcrypt or a similar library to hash passwords.
        if (user.password !== password) return res.status(400).json({ message: "Login failed: Incorrect password" });

        // 2. Explicitly create the payload to send to the frontend (Best Practice)
        const userPayload = {
            _id: user._id, 
            email: user.email,
            // 🎯 Check if 'name' exists on the Mongoose document. If it is null/undefined, this is the root cause.
            name: user.name || user.username || 'User' // Use a fallback name if 'user.name' is missing
        };

        // 3. Send the clean and structured user object
        res.status(200).json({ message: "Login successful", user: userPayload });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post('/add-interest', async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) return res.status(400).json({ message: "User ID and Course ID are required" });

        const user = await Signup.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

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
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ interestedCourses: user.interestedCourses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/remove-interest', async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) return res.status(400).json({ message: "User ID and Course ID are required" });

        const user = await Signup.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

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
    console.log(`🚀 Server running at https://localhost:${PORT}`);
});
