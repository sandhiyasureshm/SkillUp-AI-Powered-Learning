const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const UserProgress = require('../models/userProgress');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user progress for a course
router.get('/progress/:courseId/:userId', async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      user: req.params.userId,
      course: req.params.courseId
    });
    res.json(progress || { completedVideos: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark video as finished (Using robust updateOne/upsert)
router.post('/progress/mark-finished', async (req, res) => {
    const { userId, courseId, videoLink } = req.body;
    
    // Basic input validation
    if (!userId || !courseId || !videoLink) {
        return res.status(400).json({ message: 'Missing user ID, course ID, or video link.' });
    }
    
    try {
        // Use updateOne with $addToSet to add the videoLink only if it doesn't already exist.
        // { upsert: true } creates the document if it doesn't exist (if this is the user's first progress update).
        const result = await UserProgress.updateOne(
            { user: userId, course: courseId },
            { $addToSet: { completedVideos: videoLink } },
            { upsert: true }
        );

        // Check if a modification occurred (either a video was added or a new doc was created)
        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            return res.status(200).json({ message: 'Video marked as finished' });
        }
        
        // If no document was modified/upserted, the video was already in the set.
        res.status(200).json({ message: 'Video was already marked as finished' });
        
    } catch (err) {
        // CRITICAL: Log the detailed server error
        console.error("SERVER ERROR in mark-finished:", err); 
        res.status(500).json({ message: `Failed to mark video finished. Details: ${err.message}` });
    }
});
module.exports = router;
