// src/pages/tutorials/FrontendAdvanced.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Tutorials.css";

export default function FrontendAdvanced() {
  const navigate = useNavigate();

  return (
    <div className="tutorials-page">
      <div className="back-home" onClick={() => navigate("/tutorials")}>
        ← Back to Tutorials
      </div>

      <h1>Frontend Advanced</h1>

      <div className="tutorials-grid">

        {/* React Hooks & Context */}
        <div className="tutorial-category">
          <div className="tutorial-header">
            <h2>React Hooks & Context</h2>
          </div>
          <p className="tutorial-description">
            Learn state management using React Hooks and Context API for scalable apps.
          </p>
          <ul>
            <li className="tutorial-item">useState & useEffect Basics</li>
            <li className="tutorial-item">useReducer for Complex State</li>
            <li className="tutorial-item">Context API for Global State</li>
            <li className="tutorial-item">Custom Hooks for Reusability</li>
          </ul>

          <div className="tutorial-featured-video">
            <h3>Featured Video</h3>
            <iframe
              width="100%"
              height="250"
              src="httpss://www.youtube.com/embed/dpw9EHDh2bM"
              title="React Hooks Tutorial"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="tutorial-live-code">
            <h3>Live Coding</h3>
            <iframe
              src="httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark"
              style={{ width: "100%", height: "250px" }}
              title="React Live Code"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            ></iframe>
          </div>
        </div>

        {/* Redux Advanced */}
        <div className="tutorial-category">
          <div className="tutorial-header">
            <h2>Redux Advanced</h2>
          </div>
          <p className="tutorial-description">
            Manage complex state in large React apps using Redux Toolkit and middleware.
          </p>
          <ul>
            <li className="tutorial-item">Redux Toolkit Setup</li>
            <li className="tutorial-item">Slice & Store Configuration</li>
            <li className="tutorial-item">Async Thunks & Middleware</li>
            <li className="tutorial-item">Integration with React Components</li>
          </ul>

          <div className="tutorial-featured-video">
            <h3>Featured Video</h3>
            <iframe
              width="100%"
              height="250"
              src="httpss://www.youtube.com/embed/poQXNp9ItL4"
              title="Redux Tutorial"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="tutorial-live-code">
            <h3>Live Coding</h3>
            <iframe
              src="httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark"
              style={{ width: "100%", height: "250px" }}
              title="Redux Live Code"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
