// ContentSection.jsx
import React from "react";
import "../styles/Home.css";

/**
 * ContentSection Component
 * Purpose: Highlights the app's three main categories
 * with distinct titles and descriptions.
 */
const ContentSection = () => {
  return (
    <section className="content-section">
      <div className="content-card">
        <h2 className="content-title">Courses & Tutorials</h2>
        <p className="content-description">
          Access a variety of courses and tutorials to build strong technical foundations.
        </p>
      </div>

      <div className="content-card">
        <h2 className="content-title">Practice & Interviews</h2>
        <p className="content-description">
          Improve your skills with coding practice, aptitude tests, and mock interviews.
        </p>
      </div>

      <div className="content-card">
        <h2 className="content-title">Job & Career Resources</h2>
        <p className="content-description">
          Explore job opportunities and career resources tailored for tech aspirants.
        </p>
      </div>
    </section>
  );
};

export default ContentSection;
