import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    courses: [],
    tutorials: [],
    practice: [],
    govt: [],
  });

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const toSlug = (name) =>
    name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/[()]/g, "");

  const handleMouseEnter = (menu) => setOpenDropdown(menu);
  const handleMouseLeave = () => setOpenDropdown(null);

  const handleSearchResultClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleFallbackSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    const exactMatch = allSearchableItems.find(
      (item) => item.title.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) handleSearchResultClick(exactMatch.path);
    else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleFallbackSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Load user from local storage
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const storedUser = JSON.parse(userJson);
        if (storedUser && typeof storedUser === "object") setUser(storedUser);
        else localStorage.removeItem("user");
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [coursesRes, tutorialsRes, practiceRes, examsRes] = await Promise.all([
          axios.get("https://skillup-ai-powered-learning-1.onrender.com/api/dropdowns/courses"),
          axios.get("https://skillup-ai-powered-learning-1.onrender.com/api/dropdowns/tutorials"),
          axios.get("https://skillup-ai-powered-learning-1.onrender.com/api/dropdowns/practice"),
          axios.get("https://skillup-ai-powered-learning-1.onrender.com/api/dropdowns/exams"),
        ]);

        setDropdownData({
          courses: Array.isArray(coursesRes.data) ? coursesRes.data : [],
          tutorials: Array.isArray(tutorialsRes.data) ? tutorialsRes.data : [],
          practice: Array.isArray(practiceRes.data) ? practiceRes.data : [],
          govt: Array.isArray(examsRes.data) ? examsRes.data : [],
        });
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // All searchable items
  const allSearchableItems = useMemo(() => {
    const items = [];

    dropdownData.courses.forEach((item) =>
      items.push({ title: item.title || item.courseName, path: `/course/${item._id}`, category: "Course" })
    );

    dropdownData.tutorials.forEach((item) =>
      items.push({ title: item.title, path: `/tutorials/${toSlug(item.title)}`, category: "Tutorial" })
    );

    dropdownData.govt.forEach((item) =>
      items.push({ title: item.title || item.examName, path: `/govt-exams/${toSlug(item.title || item.examName)}`, category: "Govt Exam" })
    );

    const practicePages = [
      { title: "Quiz", path: "/practice/quiz", category: "Practice" },
      { title: "Coding Challenge", path: "/practice/coding", category: "Practice" },
      { title: "Mock Interview", path: "/practice/mock-interviews", category: "Practice" },
      { title: "Resume Builder", path: "/practice/resume-builder", category: "Practice" },
    ];
    items.push(...practicePages);

    return items;
  }, [dropdownData]);

  // Search filter
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      const filtered = allSearchableItems
        .filter((item) => item.title.toLowerCase().includes(query))
        .slice(0, 10);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allSearchableItems]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // JSX render
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/home")}>SkillUp</div>

      <ul className="navbar-links">
        <li onClick={() => navigate("/home")}><span className="nav-link">Home</span></li>

        {["courses", "jobs", "tutorials", "practice", "govt"].map((menu) => (
          <li
            key={menu}
            className="dropdown-container"
            onMouseEnter={() => handleMouseEnter(menu)}
            onMouseLeave={handleMouseLeave}
          >
            <span
              className="nav-link"
              onClick={() => {
                if (menu === "courses") navigate("/courses");
                else if (menu === "jobs") navigate("/jobs/freshers");
                else if (menu === "tutorials") navigate("/tutorials");
                else if (menu === "practice") navigate("/practice");
                else if (menu === "govt") navigate("/govt-exams");
              }}
            >
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </span>

            {openDropdown === menu && (
              <ul className="dropdown-menu">
                {menu === "jobs"
                  ? ["Freshers", "Experienced", "Internships", "Govt Jobs"].map((job) => (
                      <li key={job} onClick={() => navigate(`/jobs/${job.toLowerCase().replace(/ /g, "-")}`)}>{job}</li>
                    ))
                  : menu === "practice"
                  ? ["Quiz", "Coding Challenge", "Mock Interview", "Resume Builder"].map((item) => (
                      <li key={item} onClick={() => navigate(`/practice/${item.toLowerCase().replace(/ /g, "-")}`)}>{item}</li>
                    ))
                  : menu === "tutorials"
                  ? dropdownData.tutorials.map((item) => (
                      <li key={item._id} onClick={() => navigate(`/tutorials/${toSlug(item.title)}`)}>{item.title}</li>
                    ))
                  : menu === "courses"
                  ? dropdownData.courses.map((item) => (
                      <li key={item._id} onClick={() => navigate(`/course/${item._id}`)}>{item.title || item.courseName}</li>
                    ))
                  : menu === "govt"
                  ? dropdownData.govt.map((item) => (
                      <li key={item._id} onClick={() => navigate(`/govt-exams/${toSlug(item.title || item.examName)}`)}>{item.title || item.examName}</li>
                    ))
                  : null
                }
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="navbar-search" ref={searchRef}>
        <input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleFallbackSearch}>🔍</button>

        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((result, index) => (
              <li key={index} onClick={() => handleSearchResultClick(result.path)} className="search-result-item">
                <span className="result-category">[{result.category}]</span> {result.title}
              </li>
            ))}
            <li onClick={handleFallbackSearch} className="search-result-footer">
              View all results for "{searchQuery}"
            </li>
          </ul>
        )}
      </div>

      <div className="navbar-user">
        <div onClick={() => navigate("/profile")} className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">Hi, Welcome</span>
        </div>
        {user && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
