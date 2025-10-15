import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/GovtExamsHome.css";

const states = [
  "Tamil Nadu", "Maharashtra", "Karnataka", "Kerala", "West Bengal",
  "Uttar Pradesh", "Rajasthan", "Bihar", "Punjab", "Haryana",
  "Andhra Pradesh", "Odisha", "Chhattisgarh", "Gujarat",
  "Madhya Pradesh", "Telangana", "Jharkhand", "Assam", "Other States"
];

export default function GovtExamsHome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch central exam notifications
  const fetchRSSUpdates = async () => {
    setLoading(true);
    try {
      const rssFeeds = [
        "https://www.upsc.gov.in/sites/default/files/rss.xml",
        // Add official SSC, RRB, IBPS RSS feeds here
      ];

      let combinedUpdates = [];

      for (let feed of rssFeeds) {
        const res = await axios.get(
          `https://api.rss2json.com/v1/api.json`,
          { params: { rss_url: feed } }
        );

        if (res.data.status === "ok") {
          const titles = res.data.items.slice(0, 5).map(item => item.title);
          combinedUpdates = [...combinedUpdates, ...titles];
        }
      }

      if (combinedUpdates.length === 0) {
        combinedUpdates = ["No live updates found. Check official portals."];
      }

      setLiveUpdates(combinedUpdates);
    } catch (error) {
      console.error("Error fetching RSS updates:", error);
      setLiveUpdates(["Unable to load notifications. Check your connection."]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount and set interval for auto-refresh every 10 mins
  useEffect(() => {
    fetchRSSUpdates(); // Initial fetch

    const interval = setInterval(() => {
      fetchRSSUpdates();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
          <strong>State Government Exams</strong> in India.
        </p>
        <p className="highlight">
          Stay informed with official notifications and updates.
        </p>
      </header>

      <section className="exam-categories">
        <div className="exam-card central-card" onClick={() => navigate("/govt-exams/central")}>
          <h2>Central Government Exams</h2>
          <p>Explore UPSC, SSC, RRB, IBPS, and other central-level exams.</p>
          <button className="view-btn">View Central Exams</button>
        </div>

        <div className="exam-card state-card">
          <h2>State Government Exams</h2>
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
        <h2>📰 Live Central Government Exam Notifications</h2>
        <div className="updates-box">
          {loading ? (
            <p>Fetching latest official notifications...</p>
          ) : (
            liveUpdates.map((update, i) => <p key={i}>• {update}</p>)
          )}
        </div>
      </section>

      <footer className="info-section">
        <h3>📚 Important Tips for Aspirants</h3>
        <ul>
          <li>Check official notifications regularly.</li>
          <li>Follow only authorized recruitment portals.</li>
          <li>Stick to a daily study plan.</li>
          <li>Stay updated with current affairs.</li>
        </ul>
      </footer>
    </div>
  );
}
