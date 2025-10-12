import React from "react";
import "../styles/Home.css";


import courseImg from "../assets/course.png";
import aptitudeImg from "../assets/test.jpg";
import jobsImg from "../assets/job.jpg";
import govImg from "../assets/Gov.jpg";


export default function Carousel() {
  return (
    <section className="carousel-section">
      <div className="carousel-container">
        {/* Group 1 */}
        <div className="carousel-card">
          <img src={courseImg} alt="Courses" className="carousel-img" />
          <h3 className="carousel-title">Courses</h3>
          <p className="carousel-description">
            Learn coding, design, and more with top-rated courses.
          </p>
        </div>

        <div className="carousel-card">
          <img src={aptitudeImg} alt="Aptitude Tests" className="carousel-img" />
          <h3 className="carousel-title">Aptitude Tests</h3>
          <p className="carousel-description">
            Prepare for competitive exams with practice questions.
          </p>
        </div>

        <div className="carousel-card">
          <img src={jobsImg} alt="Job Preparation" className="carousel-img" />
          <h3 className="carousel-title">Job Preparation</h3>
          <p className="carousel-description">
            Get ready for interviews with mock tests and resources.
          </p>
        </div>

        <div className="carousel-card">
          <img src={govImg} alt="Government Exams" className="carousel-img" />
          <h3 className="carousel-title">Government Exams</h3>
          <p className="carousel-description">
            Access study materials for all major government exams.
          </p>
        </div>

        {/* Group 2 - Duplicate for infinite loop */}
        <div className="carousel-card">
          <img src={courseImg} alt="Courses" className="carousel-img" />
          <h3 className="carousel-title">Courses</h3>
          <p className="carousel-description">
            Learn coding, design, and more with top-rated courses.
          </p>
        </div>

        <div className="carousel-card">
          <img src={aptitudeImg} alt="Aptitude Tests" className="carousel-img" />
          <h3 className="carousel-title">Aptitude Tests</h3>
          <p className="carousel-description">
            Prepare for competitive exams with practice questions.
          </p>
        </div>

        <div className="carousel-card">
          <img src={jobsImg} alt="Job Preparation" className="carousel-img" />
          <h3 className="carousel-title">Job Preparation</h3>
          <p className="carousel-description">
            Get ready for interviews with mock tests and resources.
          </p>
        </div>

        <div className="carousel-card">
          <img src={govImg} alt="Government Exams" className="carousel-img" />
          <h3 className="carousel-title">Government Exams</h3>
          <p className="carousel-description">
            Access study materials for all major government exams.
          </p>
        </div>
      </div>
    </section>
  );
}
