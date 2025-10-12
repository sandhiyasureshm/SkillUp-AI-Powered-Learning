import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GovtExamsHome.css";

const states = [
  "Tamil Nadu",
  "Maharashtra",
  "Karnataka",
  "Kerala",
  "West Bengal",
  "Uttar Pradesh",
  "Rajasthan",
  "Bihar",
  "Punjab",
  "Haryana",
  "Andhra Pradesh",
  "Odisha",
  "Chhattisgarh",
  "Gujarat",
  "Madhya Pradesh",
  "Telangana",
  "Jharkhand",
  "Assam",
  "Other States"
];

const liveUpdates = [
  "UPSC Civil Services 2025 notification expected in February.",
  "SSC CHSL Tier-II Exam to be held in December 2025.",
  "RRB NTPC Final Results releasing soon on official portal.",
  "TNPSC Group IV new vacancies announced for 2025.",
  "IBPS PO Prelims Exam 2025 scheduled for October.",
  "SSC CGL 2025 registration opens next month.",
];

export default function GovtExamsHome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="govt-home-page">
      <button className="back-btn" onClick={() => navigate("/home")}>
        ⬅ Back to Home
      </button>

      <header className="hero-section">
        <h1>Welcome to the Government Exams Portal 🇮🇳</h1>
        <p>
          Your complete guide to all <strong>Central</strong> and{" "}
          <strong>State Government Exams</strong> in India. Explore eligibility,
          application process, syllabus, and preparation guidance for your dream job.
        </p>
        <p className="highlight">
          Stay informed and prepare smartly with verified details and updates.
        </p>
      </header>

      <section className="exam-categories">
        <div
          className="exam-card central-card"
          onClick={() => navigate("/govt-exams/central")}
        >
          <h2>Central Government Exams</h2>
          <p>
            Explore top central exams like <strong>UPSC Civil Services</strong>,
            <strong> SSC CGL</strong>, <strong>RRB NTPC</strong>,
            <strong> IBPS PO</strong>, and more. Learn about eligibility,
            recruitment process, and preparation resources.
          </p>
          <button className="view-btn">View Central Exams</button>
        </div>

        <div className="exam-card state-card">
          <h2>State Government Exams</h2>
          <p>
            Each state conducts its own exams for administrative, police,
            revenue, and public service roles. Select your state below to view
            complete details.
          </p>

          <input
            type="text"
            placeholder="🔍 Search for a state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />

          <ul className="states-list">
            {filteredStates.map((state, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/govt-exams/state/${state.toLowerCase().replace(/ /g, "-")}`)
                }
              >
                {state}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="updates-section">
        <h2>📰 Live Government Exam Updates</h2>
        <div className="updates-box">
          {liveUpdates.map((update, i) => (
            <p key={i}>• {update}</p>
          ))}
        </div>
      </section>

      <footer className="info-section">
        <h3>📚 Important Tips for Aspirants</h3>
        <ul>
          <li>Check official notifications regularly for accurate information.</li>
          <li>Follow only authorized recruitment portals.</li>
          <li>Prepare a timetable and stick to daily study targets.</li>
          <li>Stay positive and keep yourself updated with current affairs.</li>
        </ul>
      </footer>
    </div>
  );
}
