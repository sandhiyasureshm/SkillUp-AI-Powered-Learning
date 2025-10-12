import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    if (query === "") return;
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

 // Define handleLogout to ensure it exists and clears local storage
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Clear the state immediately
    navigate("/login");
  };

  // ======================================================
  // 2. SAFE User Load from Local Storage (The Critical Part)
  // ======================================================
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    
    // Check if the item exists at all
    if (userJson) {
      try {
        const storedUser = JSON.parse(userJson);
        
        // Ensure the parsed data is a valid object (not null, undefined, or a string)
        if (storedUser && typeof storedUser === 'object') {
          // Success: Set the user state
          setUser(storedUser);
        } else {
          // Data is corrupted/invalid (e.g., "null" string, or empty object)
          console.warn("Invalid user data found in storage. Clearing it.");
          localStorage.removeItem("user");
        }
      } catch (error) {
        // Parsing failed (e.g., malformed JSON)
        console.error("Error parsing user data. Clearing storage.", error);
        localStorage.removeItem("user");
      }
    }
  }, []); // Runs only once when the component mounts
  // =========================
  // Fetch Dropdown Data
  // =========================
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [coursesRes, tutorialsRes, practiceRes, examsRes] =
          await Promise.all([
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
      { title: "Quiz", path: "/practice/quiz", category: "Quiz" },
      { title: "Coding Challenge", path: "/practice/coding", category: "Coding Challenge" },
      { title: "Mock Interview", path: "/practice/mock-interviews", category: "Practice" },
      { title: "Resume Builder", path: "/practice/resume-builder", category: "Tool" },
    ];
    items.push(...practicePages);

    return items;
  }, [dropdownData]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 1) {
      const filtered = allSearchableItems
        .filter((item) => item.title.toLowerCase().includes(query))
        .slice(0, 8);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allSearchableItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // JSX Render
  // =========================
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        SkillUp
      </div>
      

      <ul className="navbar-links">
        <li onClick={() => navigate("/home")}>
          <span className="nav-link">Home</span>
        </li>

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
                {/* Dropdown Items */}
                {menu === "jobs"
                  ? ["Freshers", "Experienced", "Internships", "Govt Jobs"].map((job) => (
                      <li key={job} onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.toLowerCase().replace(/ /g, "-")}`); }}>{job}</li>
                    ))
                  : menu === "practice"
                  ? <>
                      <li onClick={() => navigate("/practice/quiz")}>📝 Quiz</li>
                      <li onClick={() => navigate("/practice/coding")}>💻 Coding Challenge</li>
                      <li onClick={() => navigate("/practice/mock-interviews")}>🎤 Mock Interview</li>
                      <li onClick={() => navigate("/practice/resume-builder")}>📄 Resume Builder</li>
                    </>
                  : menu === "tutorials"
                  ? <>
                      <li onClick={() => navigate("/tutorials/frontend-advanced")}>Frontend Advanced</li>
                      <li onClick={() => navigate("/tutorials/backend-advanced")}>Backend Advanced</li>
                      <li onClick={() => navigate("/tutorials/system-design-and-databases")}>System Design & Databases</li>
                      <li onClick={() => navigate("/tutorials/fullstack-projects")}>Fullstack Projects</li>
                      <li onClick={() => navigate("/tutorials/other-professional-skills")}>Other Professional Skills</li>
                    </>
                  : menu === "govt"
                  ? <>
                      <li onClick={() => navigate("/govt-exams")}>Govt Exams Home</li>
                      <li onClick={() => navigate("/govt-exams/central")}>Central Govt Exams</li>
                      <li onClick={() => navigate("/govt-exams/state")}>State Govt Exams</li>
                    </>
                  : Array.isArray(dropdownData[menu]) &&
                    dropdownData[menu].map((item) => (
                      <li key={item._id} onClick={(e) => { e.stopPropagation(); if(menu==="courses") navigate(`/course/${item._id}`); else navigate(`/${menu}/${toSlug(item.title)}`); }}>{item.title || item.courseName}</li>
                    ))}
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
        {/* USER PROFILE/LOGIN */}
   <div className="navbar-user">
  <div onClick={() => navigate("/profile")} className="user-info">
    <span className="user-icon">👤</span>
    <span className="user-name">Hi, Welcome</span>
  </div>
  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>
  

    </nav>
  );
}
