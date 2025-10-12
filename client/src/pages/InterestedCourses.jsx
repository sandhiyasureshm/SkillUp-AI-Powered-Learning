import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Courses.css';

const InterestedCourses = () => {
  const [user, setUser] = useState(null);
  const [interestedCourses, setInterestedCourses] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchInterestedCourses(storedUser._id);
    }
  }, []);

  // Fetch user's interested courses
  const fetchInterestedCourses = async (userId) => {
    try {
      const response = await axios.get(`http://skillup-ai-powered-learning-1.onrender.com/get-interests/${userId}`);
      setInterestedCourses(response.data.interestedCourses);
    } catch (error) {
      console.error('Error fetching interested courses:', error);
    }
  };

  // Remove course from interested list
  const handleRemove = async (courseId) => {
    if (!user) return alert('Please login to remove courses');

    try {
      await axios.post('http://skillup-ai-powered-learning-1.onrender.com/remove-interest', {
        userId: user._id,
        courseId
      });

      // Update UI
      setInterestedCourses(prev => prev.filter(course => course._id !== courseId));
      alert('Course removed from your interested list');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error removing course');
    }
  };

  return (
    <div className="courses-page">
      <nav className="navbar">
        <div className="navbar-logo">SkillUp</div>
        <ul className="navbar-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
        </ul>
        {user && <div className="navbar-user">Hi, {user.name}</div>}
      </nav>

      <h1 className="page-title">My Interested Courses</h1>

      {interestedCourses.length === 0 ? (
        <p className="no-courses">You have not added any courses to your interested list.</p>
      ) : (
        <div className="courses-grid">
          {interestedCourses.map(course => (
            <div key={course._id} className="course-card">
              <img
                src={`http://skillup-ai-powered-learning-1.onrender.com/images/${course.imageUrl}`}
                alt={course.title}
                className="course-img"
              />
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-buttons">
                <Link to={`/course/${course._id}`} className="learn-btn">Learn Course</Link>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(course._id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedCourses;
