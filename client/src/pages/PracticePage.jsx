// src/pages/PracticePage.jsx
import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom'; // Import Link
import '../styles/Practice.css';

function PracticePage() {
  // activeStyle is no longer needed here, let CSS handle it

  return (
    <div className="practice-root">
      {/* NEW: Back to Home Link (Optional: if you want a back button style)
        The main NavBar's logo already links to home, but this is an explicit path.
      */}
      <Link to="/home" className="back-to-home">
        ← Back to Home
      </Link>
      
      
      
      {/* This nav bar will now be sticky via CSS */}
      <nav className="practice-nav sticky-nav">
        <NavLink to="quiz">Quiz</NavLink>
        <NavLink to="coding">Coding Practice</NavLink>
        <NavLink to="mock-interviews">Mock Interviews</NavLink>
        <NavLink to="resume-builder">Resume Builder</NavLink>
      </nav>

      <div className="practice-content">
        <Outlet />
      </div>
    </div>
  );
}

export default PracticePage;