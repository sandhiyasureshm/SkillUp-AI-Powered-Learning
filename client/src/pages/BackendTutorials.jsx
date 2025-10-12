import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BackendTutorials.css";
import { FaNodeJs, FaDatabase, FaLock, FaServer } from "react-icons/fa";

export default function BackendTutorials() {
  const navigate = useNavigate();

  return (
    <div className="backend-tutorial-page">
      <div className="back-home" onClick={() => navigate("/tutorials")}>
        ← Back to Tutorials
      </div>

      <h1>Backend Advanced Tutorials</h1>
      <p className="intro">
        Dive into backend development — master Node.js, Express, databases, authentication, error handling, 
        and performance optimization to build robust, scalable server-side applications.
      </p>

      {/* SECTION 1 - Node.js Advanced */}
      <section className="tutorial-section">
        <h2><FaNodeJs className="icon"/> 1️⃣ Node.js Event Loop & Async Patterns</h2>
        <p>
          Understand Node.js architecture, the event loop, callbacks, promises, and async/await. 
          Learn non-blocking I/O, streams, and advanced patterns to optimize server performance.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/Oe421EPjeBE"
            title="Advanced Node.js Tutorial"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/TlB_eWDSMt4"
            title="Node.js Async Patterns & Event Loop"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/1z0-6K3a7Hk"
            title="Node.js Streams & Performance"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📚 Useful Resources:</h3>
          <ul>
            <li><a href="https://nodejs.org/en/docs/" target="_blank">Node.js Official Docs</a></li>
            <li><a href="https://www.freecodecamp.org/news/node-js-tutorial-for-beginners/" target="_blank">FreeCodeCamp Node.js Guide</a></li>
            <li><a href="https://nodeschool.io/" target="_blank">NodeSchool Interactive Tutorials</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 2 - Express.js */}
      <section className="tutorial-section">
        <h2><FaServer className="icon"/> 2️⃣ Express Middleware & Architecture</h2>
        <p>
          Learn Express.js middleware, routing, and architecture patterns for building modular, maintainable APIs.
          Explore request/response lifecycle, error handling, and production-ready server structures.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/L72fhGm1tfE"
            title="Express.js Advanced"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/gnsO8-xJ8rs"
            title="Express Middleware & Routing"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/pKd0Rpw7O48"
            title="Express.js Project Structure"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📘 Learning Links:</h3>
          <ul>
            <li><a href="https://expressjs.com/en/guide/writing-middleware.html" target="_blank">Express Middleware Guide</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs" target="_blank">MDN Express Guide</a></li>
            <li><a href="https://www.geeksforgeeks.org/node-js-express-js-introduction/" target="_blank">GeeksforGeeks Express</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 - MongoDB */}
      <section className="tutorial-section">
        <h2><FaDatabase className="icon"/> 3️⃣ MongoDB & Aggregation Framework</h2>
        <p>
          Dive into MongoDB’s flexible schema, CRUD operations, indexing, aggregation pipelines, 
          and performance tuning. Learn how to handle large datasets efficiently.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/OFjq7ihZ6jI"
            title="MongoDB Aggregation Tutorial"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/pWbMrx5rVBE"
            title="MongoDB Advanced Concepts"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/EE8ZT1lO8tY"
            title="MongoDB Indexing & Optimization"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🌐 Useful Links:</h3>
          <ul>
            <li><a href="https://www.mongodb.com/docs/" target="_blank">MongoDB Official Docs</a></li>
            <li><a href="https://www.mongodb.com/try/download/community" target="_blank">Download & Try MongoDB</a></li>
            <li><a href="https://www.w3schools.com/mongodb/" target="_blank">W3Schools MongoDB</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 4 - Authentication */}
      <section className="tutorial-section">
        <h2><FaLock className="icon"/> 4️⃣ Authentication: JWT & OAuth2</h2>
        <p>
          Learn to secure your backend applications using JSON Web Tokens (JWT) for stateless authentication,
          OAuth2 for third-party logins, and best practices for password hashing and session management.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/mbsmsi7l3r4"
            title="JWT Authentication Node.js"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/7nafaH9SddU"
            title="OAuth2 & Social Logins"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/N3AkSS5hXMA"
            title="Node.js Security Best Practices"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🔐 Useful Links:</h3>
          <ul>
            <li><a href="https://jwt.io/introduction/" target="_blank">JWT Official Guide</a></li>
            <li><a href="https://oauth.net/2/" target="_blank">OAuth2 Protocol</a></li>
            <li><a href="https://www.npmjs.com/package/bcrypt" target="_blank">Bcrypt Password Hashing</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 5 - Error Handling & Logging */}
      <section className="tutorial-section">
        <h2><FaServer className="icon"/> 5️⃣ Error Handling & Logging Strategies</h2>
        <p>
          Master error handling patterns, logging with Winston or Morgan, and monitoring backend applications 
          to ensure reliability and quick debugging in production environments.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/2v4LZZbO9rQ"
            title="Node.js Error Handling"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/rzD1b8dC1TA"
            title="Logging Strategies Node.js"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🛠️ Learning Resources:</h3>
          <ul>
            <li><a href="https://expressjs.com/en/guide/error-handling.html" target="_blank">Express Error Handling</a></li>
            <li><a href="https://github.com/winstonjs/winston" target="_blank">Winston Logger</a></li>
            <li><a href="https://www.npmjs.com/package/morgan" target="_blank">Morgan Request Logger</a></li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <p>🚀 Keep practicing backend development — robustness comes with mastery!</p>
      </footer>
    </div>
  );
}
