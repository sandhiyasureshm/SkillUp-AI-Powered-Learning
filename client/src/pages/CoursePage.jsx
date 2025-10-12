import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CoursePage.css';

// Helper function to extract YouTube video ID from URL
const extractVideoId = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
};

function CoursePage({ user: propUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [completedVideos, setCompletedVideos] = useState([]);
    const [user, setUser] = useState(propUser || null);

    // Effect to handle user state (from prop or localStorage)
    useEffect(() => {
        if (!propUser) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, [propUser]);

    // Effect to fetch course data and user progress
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await axios.get(`http://localhost:5000/courses/${id}`);
                setCourseData(courseRes.data);

                if (user && user._id) { 
                    const progressRes = await axios.get(
                        `http://localhost:5000/courses/progress/${id}/${user._id}`
                    );
                    setCompletedVideos(progressRes.data.completedVideos || []);
                }
            } catch (err) {
                console.error('Error fetching course data or progress:', err);
            }
        };
        fetchData();
    }, [id, user]);

    const handleMarkFinished = async (videoLink) => {
        if (!user || !user._id) {
            return alert('Login to mark videos as finished');
        }

        try {
            await axios.post(`http://localhost:5000/courses/progress/mark-finished`, {
                userId: user._id,
                courseId: id,
                videoLink,
            });
            setCompletedVideos((prev) => [...prev, videoLink]);
        } catch (err) {
            console.error('Error marking video finished:', err.response?.data?.message || err.message);
            alert('Failed to mark video finished. Please check the server status.');
        }
    };

    const handleMockInterviewClick = () => {
        navigate('/practice/mock-interviews');
    };

    if (!courseData) return <div className="loading">Loading...</div>;

    const videos = courseData.modules[selectedLanguage] || [];
    const totalVideos = videos.length;
    const completedCount = videos.filter((v) => completedVideos.includes(v.link)).length;
    
    // PROGRESS CALCULATION (Fixes the 0% issue)
    const progressPercentage = totalVideos > 0 
        ? Math.round((completedCount / totalVideos) * 100) 
        : 0;

    return (
        <div className="course-page">
            {/* Course Header */}
            <div className="course-header">
                <img
                    src={`http://localhost:5000/images/${courseData.imageUrl}`}
                    alt={courseData.title}
                    className="course-image"
                />
                <div className="course-info">
                    <h1 className="course-title">{courseData.title}</h1>
                    <p className="course-description">{courseData.description}</p>
                </div>
            </div>

            {/* NEW: Progress Bar Section */}
            <div className="progress-section">
                <p className="progress-text">
                    Your Progress: {completedCount} / {totalVideos} Videos Completed ({progressPercentage}%)
                </p>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
            
            {/* Language Tabs */}
            <div className="language-tabs">
                {Object.keys(courseData.modules).map((lang) => (
                    <button
                        key={lang}
                        className={`language-btn ${selectedLanguage === lang ? 'active' : ''}`}
                        onClick={() => setSelectedLanguage(lang)}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Video List */}
            <div className="modules-container">
                {videos.map((video, idx) => (
                    <div key={idx} className="video-card">
                        <div className="video-wrapper">
                            <iframe
                                width="100%"
                                height="250"
                                src={`https://www.youtube.com/embed/${extractVideoId(video.link)}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="video-controls">
                            <span className="video-title">{video.title}</span>
                            <button
                                className={`mark-btn ${completedVideos.includes(video.link) ? 'finished' : ''}`}
                                onClick={() => handleMarkFinished(video.link)}
                                disabled={completedVideos.includes(video.link)} 
                            >
                                {completedVideos.includes(video.link) ? 'Finished ✅' : 'Mark as Finished'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock Interview Button */}
            {totalVideos > 0 && completedCount === totalVideos && (
                <div className="mock-interview-container"> {/* New wrapper for centering */}
                    <button 
                        className="mock-btn"
                        onClick={handleMockInterviewClick}
                    >
                        Take Mock Interview 🚀
                    </button>
                </div>
            )}
        </div>
    );
}

export default CoursePage;