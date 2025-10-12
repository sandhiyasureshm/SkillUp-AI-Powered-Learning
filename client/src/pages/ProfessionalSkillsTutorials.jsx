import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfessionalSkillsTutorials.css";

export default function ProfessionalSkillsTutorials() {
  const navigate = useNavigate();

  return (
    <div className="professional-page">
      <div className="back-home" onClick={() => navigate("/tutorials")}>
        ← Back to Tutorials
      </div>

      <h1>Professional Skill Development</h1>
      <p className="intro">
        Learn modern professional practices for deployment, testing, version control, DevOps,
        and team collaboration to level up as a full-stack engineer.
      </p>

      {/* SECTION 1 - Unit Testing */}
      <section className="tutorial-section">
        <h2>1️⃣ Unit Testing with Jest</h2>
        <p>
          Understand unit testing concepts, how to write test cases using Jest, and ensure your
          code is reliable and bug-free.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/7r4xVDI2vho"
            title="Jest Unit Testing Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/5XQOK0v_YRE"
            title="Jest Unit Testing Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 2 - Continuous Integration */}
      <section className="tutorial-section">
        <h2>2️⃣ Continuous Integration (CI/CD)</h2>
        <p>
          Learn how to automate build, test, and deployment pipelines with CI/CD tools like
          GitHub Actions and Jenkins for efficient software delivery.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/f1wnYdLEpgI"
            title="CI/CD Pipeline Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/1Q6jz7g5ZxQ"
            title="CI/CD with GitHub Actions Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 3 - Git Mastery */}
      <section className="tutorial-section">
        <h2>3️⃣ Version Control Mastery with Git</h2>
        <p>
          Master Git for version control: branching, merging, pull requests, and collaborative
          development with best practices.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/8JJ101D3knE"
            title="Git Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/Uszj_k0DGsg"
            title="Git Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 4 - Docker & Cloud Deployment */}
      <section className="tutorial-section">
        <h2>4️⃣ Docker & Cloud Deployment</h2>
        <p>
          Learn to containerize applications using Docker and deploy them on cloud platforms like
          AWS, Heroku, or Vercel.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/fqMOX6JJhGo"
            title="Docker Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/3c-iBn73dDE"
            title="Cloud Deployment Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 5 - Team Collaboration & Agile */}
      <section className="tutorial-section">
        <h2>5️⃣ Team Collaboration & Agile Practices</h2>
        <p>
          Learn how to work effectively in teams using Agile, Scrum, task management, and collaborative
          tools for real-world software projects.
        </p>

       <div className="video-grid">
  <iframe
    src="https://www.youtube.com/embed/tlB-WAR0j-U"
    title="Agile & Scrum Tutorial 1"
    allowFullScreen
  ></iframe>
  <iframe
    src="https://www.youtube.com/embed/-tqHyAGOoAM"
    title="Team Collaboration & Scrum Tutorial 2"
    allowFullScreen
  ></iframe>
</div>

      </section>

      <footer className="footer">
        <p>🚀 Keep improving your professional skills — teamwork and good practices are key!</p>
      </footer>
    </div>
  );
}
