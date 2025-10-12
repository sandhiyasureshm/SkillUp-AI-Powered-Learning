import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate(); // ✅ Correctly inside the component

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Your Path to a Tech Career Starts Here</h1>
        <p className="hero-subtitle">
          Explore courses, practice coding, and prepare for your dream job with TutorMock.
        </p>
        <button
          className="hero-btn"
          onClick={() => navigate("/courses")}
        >
          Explore Courses
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
