import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FullstackTutorials.css";

export default function FullstackTutorials() {
  const navigate = useNavigate();

  return (
    <div className="fullstack-page">
      <div className="back-home" onClick={() => navigate("/tutorials")}>
        ← Back to Tutorials
      </div>

      <h1>Fullstack Project Tutorials</h1>
      <p className="intro">
        Master fullstack development with MERN stack by building real-world projects.
        Learn backend APIs, frontend React components, authentication, real-time features,
        AI integrations, and deployment strategies.
      </p>

      {/* SECTION 1 - MERN E-Commerce */}
      <section className="tutorial-section">
        <h2>1️⃣ MERN Stack E-Commerce Project</h2>
        <p>
          Build a complete e-commerce application with user authentication, product management,
          cart system, and payment integration. Connect frontend React UI with backend Node.js/Express APIs
          and MongoDB database.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/el5bTI6GBQ8"
            title="MERN E-Commerce Project Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/SLauY6PpjW4"
            title="MERN E-Commerce Project Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 2 - Real-Time Chat App */}
      <section className="tutorial-section">
        <h2>2️⃣ Real-Time Chat App using Socket.io</h2>
        <p>
          Implement real-time messaging using Socket.io. Covers private rooms, broadcasting messages,
          event handling, and integrating chat UI with React frontend.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/SGQM7PU9hzI"
            title="Socket.io Chat App Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/ba4T590JPnw"
            title="Socket.io Chat App Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 3 - AI Integration */}
      <section className="tutorial-section">
        <h2>3️⃣ AI Integration with OpenAI API</h2>
        <p>
          Integrate AI features in your projects using OpenAI API. Build chatbots, content generation,
          or recommendation systems with secure API calls from frontend and backend.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/1d0r2HfReo4"
            title="OpenAI API Integration Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/te6y-xVteyY"
            title="OpenAI API Integration Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 4 - Portfolio Website */}
      <section className="tutorial-section">
        <h2>4️⃣ Portfolio Website with Authentication</h2>
        <p>
          Create a professional portfolio featuring user login/signup, dynamic content,
          admin dashboard, and integration with backend APIs. Showcase projects and skills interactively.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/rTYFjciPgXU"
            title="Portfolio Website Fullstack Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/TzE2eK-HpC0"
            title="Portfolio Website Fullstack Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* SECTION 5 - Error Handling & Deployment */}
      <section className="tutorial-section">
        <h2>5️⃣ Advanced Error Handling and Deployment</h2>
        <p>
          Learn best practices for error handling, logging, and deploying fullstack projects
          to production. Deploy MERN apps on Vercel, Netlify, or Heroku.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/ThdRFzHh7L0"
            title="MERN Error Handling & Deployment Tutorial 1"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/K4R9zK3JJ6g"
            title="MERN Error Handling & Deployment Tutorial 2"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <footer className="footer">
        <p>🚀 Keep building fullstack projects — hands-on practice ensures mastery!</p>
      </footer>
    </div>
  );
}
