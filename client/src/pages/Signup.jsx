import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import "../styles/AuthLayout.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/reg', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert('Signup Successful!');
      navigate('/login');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
  <div className="auth-container">
    {/* Left Branding Panel */}
    <div className="auth-left">
      <h1 className="auth-headline">
        ✨ Skill Up. Learn. Get Hired.
      </h1>
      <p className="auth-subtext">
        Master industry-relevant skills, prepare for interviews, and launch your dream career —
        all from a single, powerful platform.
      </p>

      <div className="feature-card">
        <h3>🎓 All-in-One Learning</h3>
        <p>
          Access courses across trending domains — coding, AI, data science, and more —
          designed to make you job-ready.
        </p>
      </div>

      <div className="feature-card">
        <h3>📝 Job Preparation Hub</h3>
        <p>
          Practice mock interviews, solve real-world problems, and build confidence
          with AI-powered feedback and personalized guidance.
        </p>
      </div>

      <div className="feature-card">
        <h3>🌐 Explore Career Resources</h3>
        <p>
          Access curated links to trusted websites for skill-building, certifications,
          and job opportunities — all in one place to simplify your career journey.
        </p>
      </div>
    </div>
  


      {/* Right Signup Form */}
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Retype Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn">Sign Up</button>

          <p className="switch-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
