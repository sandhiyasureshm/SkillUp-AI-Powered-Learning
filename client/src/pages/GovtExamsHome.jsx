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

const rssFeeds = [
  { name: "UPSC", url: "https://www.upsc.gov.in/sites/default/files/rss.xml" },
  { name: "SSC", url: "https://ssc.nic.in/rss" },
  { name: "RRB", url: "https://www.rrbcdg.gov.in/rss.xml" },
  { name: "IBPS", url: "https://www.ibps.in/feed/" },
];

export default function GovtExamsHome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch updates from all RSS feeds
  useEffect(() => {
    const fetchAllFeeds = async () => {
      try {
        const allUpdates = [];

        for (const feed of rssFeeds) {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
          const response = await axios.get(proxyUrl);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data.contents, "text/xml");
          const items = Array.from(xmlDoc.getElementsByTagName("item")).slice(0, 5); // 5 per feed
          const updates = items.map(item => `${feed.name}: ${item.getElementsByTagName("title")[0].textContent}`);
          allUpdates.push(...updates);
        }

        setLiveUpdates(allUpdates.length > 0 ? allUpdates : ["No updates available at the moment."]);
      } catch (error) {
        console.error("Error fetching RSS updates:", error);
        setLiveUpdates(["Unable to load live updates. Please check your connection."]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeeds();
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
          Your complete guide to all <strong>Central</strong> and <strong>State Government Exams</strong> in India.
        </p>
        <p className="highlight">
          Stay informed and prepare smartly with verified details and updates.
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
        <h2>📰 Live Central Government Exam Updates</h2>
        <div className="updates-box">
          {loading ? (
            <p>Fetching latest official notifications...</p>
          ) : Array.isArray(liveUpdates) && liveUpdates.length > 0 ? (
            liveUpdates.map((update, i) => <p key={i}>• {update}</p>)
          ) : (
            <p>No updates available at the moment.</p>
          )}
        </div>
      </section>

      <footer className="info-section">
        <h3>📚 Important Tips for Aspirants</h3>
        <ul>
          <li>Check official notifications regularly for accurate info.</li>
          <li>Follow only authorized recruitment portals.</li>
          <li>Stick to a daily study plan.</li>
          <li>Stay updated with current affairs.</li>
        </ul>
      </footer>
    </div>
  );
}
