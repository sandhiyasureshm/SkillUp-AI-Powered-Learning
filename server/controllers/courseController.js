const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Add a course to "interested courses"
exports.addInterestedCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    if (!user.interestedCourses.includes(courseId)) {
      user.interestedCourses.push(courseId);
      course.likeCount += 1;
      await user.save();
      await course.save();
      return res.json({ message: 'Course added to interested list' });
    }

    return res.json({ message: 'Course already marked as interested' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track a course view
exports.trackView = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Increment view count only once per user
    if (!course.viewers.includes(userId)) {
      course.viewers.push(userId);
      course.viewCount += 1;
      await course.save();
    }

    res.json({ message: 'View tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch interested courses for a user
exports.getInterestedCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('interestedCourses');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.interestedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
