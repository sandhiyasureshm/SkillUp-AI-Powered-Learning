import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/JobsPage.css";
import { FaPaperPlane } from "react-icons/fa";


const slugToCategory = {
  fresher: "fresher",
  experienced: "experienced",
  "it-software": "it-software",
  marketing: "marketing",
  internships: "internships",
  govt: "govt",
};

export default function JobsPage() {
  const { category } = useParams();
  const mappedCategory = slugToCategory[category] || "fresher";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://skillup-ai-powered-learning-1.onrender.com/api/jobs/${mappedCategory}`, {
        params: {
          query: searchQuery,
          location: selectedLocation,
          jobType: selectedJobType,
        },
      });
      setJobs(response.data);
    } catch (err) {
      console.error("❌ Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again.");
      setJobs([]);
    }
    setLoading(false);
  };

  // Fetch jobs whenever filters change
  useEffect(() => {
    fetchJobs();
  }, [mappedCategory, searchQuery, selectedLocation, selectedJobType]);

  return (
    <div className="jobs-page">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Find Your Dream Job</h1>
        <p className="hero-subtitle">
          Explore {category ? category : "all"} job opportunities tailored for you
        </p>

        {/* Search & Filters */}
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <button onClick={fetchJobs}>Search</button>
        </div>
      </section>

      {/* Jobs Display */}
      {loading && <p className="loading">Loading jobs...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3 className="job-title">{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            <p className="description">{job.description?.substring(0, 150)}...</p>
            <a
  href={job.url}
  target="_blank"
  rel="noopener noreferrer"
  className="apply-btn"
>
  <FaPaperPlane style={{ marginRight: "8px" }} />
  Apply
</a>

            <p className="salary">{job.salary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
