import React from "react";
import "../styles/Home.css";

export default function CourseCategories({ navigate }) {
  return (
    <section className="course-section">
      <h2 className="section-title">Popular Course Categories</h2>

      <div className="course-grid">
        {/* Web Development */}
        <div
          className="course-card"
          onClick={() => navigate("/courses/web")}
        >
          <h3 className="course-title">Web Development</h3>
          <p className="course-description">
            HTML, CSS, JavaScript, React, Node.js — full-stack paths and projects.
          </p>
        </div>

        {/* Data Science */}
        <div
          className="course-card"
          onClick={() => navigate("/courses/data")}
        >
          <h3 className="course-title">Data Science</h3>
          <p className="course-description">
            Python, ML essentials, Pandas, model building and evaluation workflows.
          </p>
        </div>

        {/* Mobile App Development */}
        <div
          className="course-card"
          onClick={() => navigate("/courses/mobile")}
        >
          <h3 className="course-title">Mobile App Dev</h3>
          <p className="course-description">
            Android (Kotlin), iOS (Swift), cross-platform React Native projects.
          </p>
        </div>

        {/* DevOps & Cloud */}
        <div
          className="course-card"
          onClick={() => navigate("/courses/devops")}
        >
          <h3 className="course-title">DevOps & Cloud</h3>
          <p className="course-description">
            CI/CD, Docker, Kubernetes, AWS fundamentals for production-ready apps.
          </p>
        </div>
      </div>
    </section>
  );
}
