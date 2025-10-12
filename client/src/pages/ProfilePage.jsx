import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css"; 

// --- Mock Bar Chart Component ---
const PerformanceChart = ({ enrolled, completed }) => {
    // Calculate completion rate safely
    const completionRate = enrolled > 0 ? ((completed / enrolled) * 100).toFixed(0) : 0;
    
    return (
        <div className="performance-chart-container">
            <h4>Performance Overview</h4>
            <div className="performance-bar-wrapper">
                <div className="performance-bar" style={{ width: `${completionRate}%` }}>
                    {completionRate}% Complete
                </div>
            </div>
            <div className="performance-stats">
                <span>Enrolled: {enrolled}</span>
                <span>Completed: {completed}</span>
            </div>
        </div>
    );
};
// ---------------------------------

function ProfilePage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Get user data from localStorage for initial checks and API call
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail = storedUser?.email;

    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    
    // State for Password Management
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    
    // State for Image Management
    const [profilePicFile, setProfilePicFile] = useState(null); 
    const [previewURL, setPreviewURL] = useState(
        storedUser?.profilePic || "/default-profile.png"
    );
    const [loading, setLoading] = useState(true);

    // --- Data Fetch and Lifecycle ---
    useEffect(() => {
        if (!userEmail) {
            navigate("/login");
            return;
        }
        
        const fetchUser = async () => {
            try {
                // Ensure the backend endpoint returns populated course data
                const res = await axios.get(
                    `https://skillup-ai-powered-learning-1.onrender.com/api/users/${encodeURIComponent(userEmail)}`
                );
                const userData = res.data;
                setUser(userData);
                setFormData(userData);
                setPreviewURL(userData.profilePic || "/default-profile.png");
            } catch (err) {
                console.error("Error fetching user:", err);
                // Handle token expiration/invalid user
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userEmail, navigate]);
    
    // Handle input changes for main profile form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --- Image Handling Functions ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleCancelImage = () => {
        setProfilePicFile(null);
        setPreviewURL(user?.profilePic || "/default-profile.png");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- Save updated profile ---
    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            alert("Name and Email are required!");
            return;
        }

        const form = new FormData();
        
        for (const key in formData) {
            // Exclude complex objects and email (as it's in the path)
            if (key !== "courses" && key !== "interestedCourses" && key !== "profilePic" && key !== "email") {
                // IMPORTANT: Ensure an empty string is sent if value is null/undefined
                form.append(key, formData[key] || ""); 
            }
        }
        
        // Image logic
        if (profilePicFile === 'REMOVE_PIC') {
            form.append("profilePic", "REMOVE_PIC");
        } else if (profilePicFile) {
            form.append("profilePic", profilePicFile);
        }
        
        try {
            const res = await axios.put(
                `https://skillup-ai-powered-learning-1.onrender.com/api/users/${encodeURIComponent(userEmail)}`,
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            
            const updatedUser = res.data.updatedUser;
            
            setUser(updatedUser);
            setFormData(updatedUser);
            setEditMode(false);
            setProfilePicFile(null);
            setPreviewURL(updatedUser.profilePic || "/default-profile.png");
            
            // Update local storage for immediate NavBar sync
            localStorage.setItem("user", JSON.stringify(updatedUser)); 

            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Profile update failed.");
        }
    };
    
    // --- Password Change Handlers ---
    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("New password and confirmation password do not match.");
        return;
    }

    if (passwordForm.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long.");
        return;
    }

    try {
        const res = await axios.put(
            // Correct URL path: /api/users/change-password/:email
            `https://skillup-ai-powered-learning-1.onrender.com/api/users/change-password/${encodeURIComponent(userEmail)}`,
            {
                // Sends the passwords as plain text JSON body
                currentPassword: passwordForm.currentPassword, 
                newPassword: passwordForm.newPassword
            }
        );

        if (res.status === 200) {
            setPasswordSuccess("Password updated successfully! You must use your new password next time.");
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    } catch (err) {
        console.error("Password change failed:", err.response ? err.response.data : err.message);
        setPasswordError(err.response?.data?.message || "Password update failed. Check your current password.");
    }
};
    // Helper for performance calculation
    const enrolledCoursesCount = user?.courses?.length || 0;
    const completedCoursesCount = user?.courses?.filter(c => c.status === 'Completed').length || 0;

    if (loading) return <div className="profile-loading">Loading profile...</div>;
    if (!user) return <div className="profile-error">Could not load user profile.</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                {/* Back to Home Button (positioned absolutely via CSS) */}
                <button onClick={() => navigate("/home")} className="back-home-btn">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </button>
                
                <h2>👋 Welcome back, {user.name.split(' ')[0]}!</h2>
                <p>Your educational dashboard.</p>
            </div>
            
            {/* --- DASHBOARD SECTION --- */}
            <div className="dashboard-section">
                <div className="profile-summary">
                    {/* Profile Picture Area */}
                    <div className="profile-pic-area">
                        <div className="profile-pic-wrapper">
                            {/* Conditional rendering for image vs. placeholder text */}
                            {previewURL && previewURL !== "/default-profile.png" ? (
                                <img src={previewURL} alt="User Profile" className="summary-pic" />
                            ) : (
                                <div className="summary-pic profile-placeholder">
                                    Profile
                                </div>
                            )}
                        </div>
                        
                        {editMode && (
                            <div className="profile-pic-controls">
                                <input type="file" id="profilePicUpload" onChange={handleFileChange} ref={fileInputRef} accept="image/*" style={{ display: 'none' }} />
                                <button onClick={() => fileInputRef.current.click()} className="btn-upload" title="Upload New Image">
                                    <i className="fas fa-camera"></i> Change
                                </button>
                                
                                {profilePicFile && profilePicFile !== 'REMOVE_PIC' && (
                                    <button onClick={handleCancelImage} className="btn-cancel-upload" title="Cancel Upload">
                                        <i className="fas fa-times"></i> Cancel
                                    </button>
                                )}
                                
                                {user.profilePic && !profilePicFile && (
                                    <button onClick={() => { setProfilePicFile('REMOVE_PIC'); setPreviewURL("/default-profile.png"); }} className="btn-remove" title="Remove Current Image">
                                        <i className="fas fa-trash"></i> Remove
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="summary-info">
                        <h3 className="text-answer">{user.name}</h3>
                        <p><span className="text-question">Email:</span> <span className="text-answer">{user.email}</span></p>
                        <p><span className="text-question">Phone:</span> <span className="text-answer">{user.phone || "N/A"}</span></p>
                        <p><span className="text-question">Address:</span> <span className="text-answer">{user.address || "N/A"}</span></p>
                    </div>
                </div>
                
                <div className="performance-section">
                    <PerformanceChart 
                        enrolled={enrolledCoursesCount} 
                        completed={completedCoursesCount} 
                    />
                </div>
            </div>
            
            {/* --- DETAILED PROFILE EDIT/VIEW --- */}
            <div className="profile-card">
                <div className="card-header">
                    <h3>Detailed Information</h3>
                    <div className="profile-actions">
                        {editMode ? (
                            <>
                                <button onClick={handleSave} className="save-btn">
                                    <i className="fas fa-save"></i> Save Changes
                                </button>
                                <button onClick={() => { setEditMode(false); handleCancelImage(); }} className="cancel-btn">
                                    <i className="fas fa-undo"></i> Cancel
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditMode(true)} className="edit-btn">
                                <i className="fas fa-edit"></i> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="profile-info-grid">
                    {editMode ? (
                        // Edit Mode Inputs
                        <>
                            <label className="text-question">Full Name:</label>
                            <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Full Name" className="text-answer" />
                            
                            <label className="text-question">Phone Number:</label>
                            <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone Number" className="text-answer" />
                            
                            <label className="text-question">Address:</label>
                            <input name="address" value={formData.address || ""} onChange={handleChange} placeholder="Address" className="text-answer" />
                            
                            <label className="text-question">Date of Birth:</label>
                            <input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ""} onChange={handleChange} className="text-answer" />
                            
                            <label className="text-question">Occupation:</label>
                            <input name="occupation" value={formData.occupation || ""} onChange={handleChange} placeholder="Occupation" className="text-answer" />
                            
                            <label className="text-question">Education:</label>
                            <input name="education" value={formData.education || ""} onChange={handleChange} placeholder="Highest Education" className="text-answer" />

                            <label className="text-question">Member Since:</label>
                            <span className="text-answer">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </>
                    ) : (
                        // Read Mode Display
                        <>
                            <p><span className="text-question">Full Name:</span> <span className="text-answer">{user.name}</span></p>
                            <p><span className="text-question">Email:</span> <span className="text-answer">{user.email}</span></p>
                            <p><span className="text-question">Phone:</span> <span className="text-answer">{user.phone || "Not provided"}</span></p>
                            <p><span className="text-question">Address:</span> <span className="text-answer">{user.address || "Not provided"}</span></p>
                            <p><span className="text-question">Date of Birth:</span> <span className="text-answer">{user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"}</span></p>
                            <p><span className="text-question">Occupation:</span> <span className="text-answer">{user.occupation || "Not provided"}</span></p>
                            <p><span className="text-question">Education:</span> <span className="text-answer">{user.education || "Not provided"}</span></p>
                            <p><span className="text-question">Member Since:</span> <span className="text-answer">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                        </>
                    )}
                </div>
            </div>
            
            {/* --- CHANGE PASSWORD SECTION --- */}
            <div className="profile-card password-section">
                <h3>🔒 Change Password</h3>
                <form onSubmit={handleChangePassword} className="password-form-grid">
                    <label htmlFor="currentPassword" className="text-question">Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="text-answer"
                    />

                    <label htmlFor="newPassword" className="text-question">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="text-answer"
                    />

                    <label htmlFor="confirmPassword" className="text-question">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="text-answer"
                    />
                    
                    {passwordError && <p className="password-message password-error-msg">{passwordError}</p>}
                    {passwordSuccess && <p className="password-message password-success-msg">{passwordSuccess}</p>}
                    
                    <button type="submit" className="change-password-btn">
                        Update Password
                    </button>
                </form>
            </div>
            
            {/* --- ENROLLED COURSES SECTION --- */}
            <div className="profile-card course-list-section">
                <h3>Enrolled Courses ({enrolledCoursesCount})</h3>
                <ul className="course-list">
                    {user.courses?.length > 0 ? (
                        user.courses.map((c, i) => (
                            <li key={i} className={`course-status-${c.status.toLowerCase()}`}>
                                <i className={`fas fa-${c.status === 'Completed' ? 'check-circle' : 'spinner'}`}></i>
                                <span>{c.courseId?.title || "Unnamed Course"}</span>
                                <span className="course-status-badge">({c.status})</span>
                            </li>
                        ))
                    ) : (
                        <li className="no-data">You are not currently enrolled in any courses.</li>
                    )}
                </ul>
            </div>

            {/* --- INTERESTED COURSES SECTION --- */}
            <div className="profile-card course-list-section">
                <h3>Interested Courses ({user.interestedCourses?.length || 0})</h3>
                <ul className="course-list">
                    {user.interestedCourses?.length > 0 ? (
                        user.interestedCourses.map((c, i) => (
                            <li key={i}><i className="fas fa-heart"></i> {c.title || "Unnamed Course"}</li>
                        ))
                    ) : (
                        <li className="no-data">No courses added to your wishlist yet.</li>
                    )}
                </ul>
            </div>

        </div>
    );
}

export default ProfilePage;
