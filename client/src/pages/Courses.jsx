import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Courses.css';

const Courses = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [interestedCourses, setInterestedCourses] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchInterestedCourses(storedUser._id);
        }

        fetchAllCourses();
    }, []);

    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/courses');
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Fetch user interested courses
    const fetchInterestedCourses = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/get-interests/${userId}`);
            setInterestedCourses(response.data.interestedCourses.map(c => c._id));
        } catch (error) {
            console.error('Error fetching interested courses:', error);
        }
    };

    // Add course to interested list
    const handleInterested = async (courseId) => {
        if (!user) return alert('Please login to add courses to interested list');

        try {
            const response = await axios.post('http://localhost:5000/add-interest', {
                userId: user._id,
                courseId
            });

            alert(response.data.message);
            fetchInterestedCourses(user._id); // Update UI after adding
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error adding course to interested list');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">SkillUp</div>
                <ul className="navbar-links">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/courses">Courses</Link></li>
                    <li>
                        <Link to="/interested-courses">
                            <button className="interested-btn">Interested Courses</button>
                        </Link>
                    </li>
                </ul>
                {user && <div className="navbar-user">Hi, {user.name.split(' ')[0]}</div>} 
            </nav>

            <div className="courses-page-container">
                <h1 className="page-title">Explore Our Skill Paths</h1>

                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course._id} className="course-card">
                            <img
                                src={`http://localhost:5000/images/${course.imageUrl}`}
                                alt={course.title}
                                className="course-img"
                            />
                            <div className="card-content">
                                <h3 className="course-title">{course.title}</h3>
                                {/* Using a fixed max length for description for uniform card heights */}
                                <p className="course-description">
                                    {course.description.length > 80 
                                        ? course.description.substring(0, 80) + '...' 
                                        : course.description}
                                </p>
                                <div className="course-buttons">
                                    <Link to={`/course/${course._id}`} className="learn-btn">
                                        Start Learning
                                    </Link>
                                    <button
                                        className="interested-course-btn"
                                        disabled={interestedCourses.includes(course._id)}
                                        onClick={() => handleInterested(course._id)}
                                    >
                                        {interestedCourses.includes(course._id) ? 'Added ✅' : '⭐ Interested'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Courses;