import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TutorialsPage.css";
import { FaReact, FaNodeJs, FaDatabase, FaProjectDiagram, FaCogs } from "react-icons/fa";

// Helper function to create a URL-friendly slug
const toSlug = (category) => 
  category.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");

const tutorialsData = [
  {
    category: "Frontend Advanced",
    icon: <FaReact color="#61dafb" size={30} />,
    description: "Master modern frontend technologies and best practices to build performant, scalable applications.",
    topics: ["React Hooks & Context", "Redux Advanced", "Next.js SSR/SSG", "Performance Optimization"],
    featuredVideo: "httpss://www.youtube.com/embed/dGcsHMXbSOA",
    codeSandbox: "httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark",
  },
  {
    category: "Backend Advanced",
    icon: <FaNodeJs color="#68a063" size={30} />,
    description: "Deep dive into backend frameworks, database design, and security for robust APIs.",
    topics: ["Node.js Advanced", "Express Middleware", "MongoDB Aggregation", "JWT & OAuth2 Auth"],
    featuredVideo: "httpss://www.youtube.com/embed/Oe421EPjeBE",
    codeSandbox: "httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark",
  },
  // 💡 NEW ENTRY FOR ADVANCED TUTORIALS
  {
    category: "System Design & Databases",
    icon: <FaDatabase color="#059669" size={30} />, 
    description: "Learn to design scalable, fault-tolerant systems and master advanced database concepts like indexing and scaling.",
    topics: ["Microservices Architecture", "Scaling & Load Balancing", "SQL/NoSQL Tradeoffs", "Database Indexing & Sharding"],
    featuredVideo: "httpss://www.youtube.com/embed/YpX536-1uCg", // Placeholder
    codeSandbox: "httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark",
  },
  {
    category: "Fullstack Projects",
    icon: <FaProjectDiagram color="#f97316" size={30} />,
    description: "Build real-world projects integrating frontend and backend to showcase your skills.",
    topics: ["MERN E-commerce", "Real-time Chat App", "AI Integration Projects", "Portfolio Website"],
    featuredVideo: "httpss://www.youtube.com/embed/7CqJlxBYj-M",
    codeSandbox: "httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark",
  },
  {
    category: "Other Professional Skills",
    icon: <FaCogs color="#6366f1" size={30} />,
    description: "Boost your professional profile with DevOps, testing, and version control mastery.",
    topics: ["Unit Testing & TDD", "CI/CD Pipeline", "Advanced Git", "Cloud Deployment Basics"],
    featuredVideo: "httpss://www.youtube.com/embed/1Z5K6nR3p4Y",
    codeSandbox: "httpss://codesandbox.io/embed/new?fontsize=14&hidenavigation=1&theme=dark",
  },
];

export default function TutorialsPage() {
  const navigate = useNavigate();

  return (
    <div className="tutorials-page">
      {/* Back to Home Link */}
      <div className="back-home" onClick={() => navigate("/home")}>
        ← Back to Home
      </div>

      <h1>Advanced Tutorials & Learning Tracks</h1>

      <div className="tutorials-grid">
        {tutorialsData.map((tutorial) => (
          <div 
            key={tutorial.category} 
            className="tutorial-category" 
            // 💡 NAVIGATION IMPLEMENTATION
            onClick={() => navigate(`/tutorials/${toSlug(tutorial.category)}`)}
            style={{ cursor: 'pointer' }} // Add cursor style for better UX
          >
            <div className="tutorial-header">
              {tutorial.icon}
              <h2>{tutorial.category}</h2>
            </div>
            <p className="tutorial-description">{tutorial.description}</p>
            <ul>
              {tutorial.topics.map((topic) => (
                <li key={topic} className="tutorial-item">{topic}</li>
              ))}
            </ul>

            {/* Featured Video */}
            <div className="tutorial-featured-video">
              <h3>Featured Demo</h3>
              <iframe
                width="100%"
                height="180"
                src={tutorial.featuredVideo}
                title={`${tutorial.category} Demo`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Live Code / Try It Online */}
            <div className="tutorial-live-code">
              <h3>Try It Online</h3>
              <iframe
                src={tutorial.codeSandbox}
                style={{ width: "100%", height: "300px", border: "1px solid #ddd", borderRadius: "10px" }}
                title={`${tutorial.category} Live Code`}
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
