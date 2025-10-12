import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdvancedTutorials.css";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaMobileAlt } from "react-icons/fa";

export default function FrontendTutorials() {
  const navigate = useNavigate();

  return (
    <div className="advanced-tutorial-page">
      <button className="back-home" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <h1>Frontend Advanced Tutorials</h1>
      <p className="intro">
        Master advanced frontend development — HTML5, CSS3, JavaScript ES6+, React.js, and responsive design.
        Build interactive, scalable, and production-ready interfaces while learning best practices, accessibility,
        and deployment strategies.
      </p>

      {/* SECTION 1 - HTML5 */}
      <section className="tutorial-section">
        <h2><FaHtml5 className="icon"/> 1️⃣ HTML5 Mastery</h2>
        <p>
          HTML5 is the foundation of modern web development. Learn semantic tags for structured content,
          forms and validation, multimedia embedding (audio, video), canvas graphics, accessibility
          practices (ARIA roles), and SEO-friendly layouts.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/3JluqTojuME"
            title="HTML5 Tutorial"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/pQN-pnXPaVg"
            title="HTML5 Advanced Concepts"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/Oe421EPjeBE"
            title="HTML5 Forms & Validation"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📚 Useful Resources:</h3>
          <ul>
            <li><a href="httpss://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">MDN HTML5 Guide</a></li>
            <li><a href="httpss://www.w3schools.com/html/" target="_blank">W3Schools HTML5</a></li>
            <li><a href="httpss://www.freecodecamp.org/learn/2022/responsive-web-design/" target="_blank">FreeCodeCamp HTML5</a></li>
            <li><a href="httpss://codepen.io/trending" target="_blank">Try HTML Online on CodePen</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 2 - CSS3 */}
      <section className="tutorial-section">
        <h2><FaCss3Alt className="icon"/> 2️⃣ CSS3 Advanced</h2>
        <p>
          CSS3 powers the visual styling of modern websites. Explore Grid layouts, Flexbox, transitions, 
          animations, pseudo-classes, variables, responsive typography, and theming for a professional
          design workflow.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/1Rs2ND1ryYc"
            title="CSS Flexbox & Grid"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/jV8B24rSN5o"
            title="CSS Animations & Transitions"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/yfoY53QXEnI"
            title="CSS Variables & Modern Techniques"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📚 Useful Resources:</h3>
          <ul>
            <li><a href="httpss://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank">MDN CSS Reference</a></li>
            <li><a href="httpss://css-tricks.com/" target="_blank">CSS-Tricks Advanced Guides</a></li>
            <li><a href="httpss://www.w3schools.com/css/" target="_blank">W3Schools CSS3</a></li>
            <li><a href="httpss://codepen.io/trending" target="_blank">Try CSS Online on CodePen</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 - JavaScript */}
      <section className="tutorial-section">
        <h2><FaJs className="icon"/> 3️⃣ JavaScript (ES6+)</h2>
        <p>
          Master modern JavaScript with ES6+ features: arrow functions, template literals, modules, 
          promises, async/await, fetch API, DOM manipulation, event handling, and building interactive
          web applications.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/NCwa_xi0Uuc"
            title="JavaScript ES6+ Advanced"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/PoRJizFvM7s"
            title="Async JS & Fetch API"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/0ik6X4DJKCc"
            title="JavaScript DOM Manipulation"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🌐 Learning Links:</h3>
          <ul>
            <li><a href="httpss://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">MDN JavaScript Docs</a></li>
            <li><a href="httpss://javascript.info/" target="_blank">JavaScript.info</a></li>
            <li><a href="httpss://www.geeksforgeeks.org/javascript/" target="_blank">GeeksforGeeks JS</a></li>
            <li><a href="httpss://stackblitz.com/" target="_blank">Try JS Online on StackBlitz</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 4 - React.js */}
      <section className="tutorial-section">
        <h2><FaReact className="icon"/> 4️⃣ React.js Advanced</h2>
        <p>
          Dive into advanced React concepts: Hooks (useState, useEffect), Context API, React Router, 
          performance optimization, state management with Redux, and building scalable SPA applications.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/Law7wfdg_ls"
            title="React Hooks Full Course"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/9jULHSe41ls"
            title="React Performance Optimization"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/Dorf8i6lCuk"
            title="React Context & Redux Tutorial"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📘 Recommended Links:</h3>
          <ul>
            <li><a href="httpss://react.dev/learn" target="_blank">React Official Docs</a></li>
            <li><a href="httpss://redux.js.org/" target="_blank">Redux Documentation</a></li>
            <li><a href="httpss://reactrouter.com/en/main" target="_blank">React Router Docs</a></li>
            <li><a href="httpss://codesandbox.io/s/new" target="_blank">Try React Online</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 5 - Responsive Design & Deployment */}
      <section className="tutorial-section">
        <h2><FaMobileAlt className="icon"/> 5️⃣ Responsive Design & Deployment</h2>
        <p>
          Learn responsive layouts with media queries, flexible grids, accessibility standards,
          and deploy your projects professionally using Netlify, Vercel, or GitHub Pages.
        </p>

        <div className="video-grid">
          <iframe
            src="httpss://www.youtube.com/embed/srvUrASNj0s"
            title="Responsive Design Tutorial"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/2TnsNFS9ptU"
            title="Deploy React Apps"
            allowFullScreen
          ></iframe>
          <iframe
            src="httpss://www.youtube.com/embed/UO4mx5u5S4Y"
            title="Responsive Web Design & Accessibility"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🧰 Tools & Platforms:</h3>
          <ul>
            <li><a href="httpss://vercel.com/" target="_blank">Vercel Deployment</a></li>
            <li><a href="httpss://www.netlify.com/" target="_blank">Netlify Hosting</a></li>
            <li><a href="httpss://pages.github.com/" target="_blank">GitHub Pages</a></li>
            <li><a href="httpss://www.freecodecamp.org/learn/responsive-web-design/" target="_blank">FreeCodeCamp Responsive Design</a></li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <p>🚀 Keep learning consistently — mastery comes with practice!</p>
      </footer>
    </div>
  );
}
