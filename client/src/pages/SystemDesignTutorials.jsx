import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SystemDesignTutorials.css";
import { FaServer, FaDatabase, FaProjectDiagram, FaNetworkWired } from "react-icons/fa";

export default function SystemDesignTutorials() {
  const navigate = useNavigate();

  return (
    <div className="systemdesign-page">
      <div className="back-home" onClick={() => navigate("/tutorials")}>
        ← Back to Tutorials
      </div>

      <h1>System Design & Database Engineering</h1>
      <p className="intro">
        Learn to design scalable architectures and efficient databases used in large-scale production systems.
      </p>

      {/* SECTION 1 - Microservices */}
      <section className="tutorial-section">
        <h2><FaServer className="icon"/> 1️⃣ Microservices Architecture Overview</h2>
        <p>
          Understand microservices fundamentals, service decomposition, communication patterns, 
          and deployment strategies for building scalable distributed systems.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/rv4LlmLmVWk"
            title="Microservices Architecture Explained"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/lL_j7ilk7rc"
            title="Microservices Explained in 5 Minutes"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📚 Useful Links:</h3>
          <ul>
            <li><a href="https://microservices.io/patterns/index.html" target="_blank">Microservices.io Patterns</a></li>
            <li><a href="https://martinfowler.com/microservices/" target="_blank">Martin Fowler on Microservices</a></li>
            <li><a href="https://www.nginx.com/blog/introduction-to-microservices/" target="_blank">NGINX Microservices Guide</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 2 - Scaling & Load Balancing */}
      <section className="tutorial-section">
        <h2><FaNetworkWired className="icon"/> 2️⃣ Scaling & Load Balancing Techniques</h2>
        <p>
          Explore horizontal vs vertical scaling, caching strategies, load balancers, CDNs, and designing 
          highly available and fault-tolerant systems.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/nHnSKgyftAw"
            title="Load Balancing, Auto Scaling & High Availability"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/0mwgbiJae5Q"
            title="Auto Scaling and Load Balancing on AWS"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🌐 Learning Links:</h3>
          <ul>
            <li><a href="https://aws.amazon.com/architecture/scaling-your-application/" target="_blank">AWS Scaling Guide</a></li>
            <li><a href="https://www.nginx.com/resources/glossary/load-balancing/" target="_blank">Load Balancing Concepts</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance" target="_blank">Performance & Optimization</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 - Database Design */}
      <section className="tutorial-section">
        <h2><FaDatabase className="icon"/> 3️⃣ SQL vs NoSQL Database Design</h2>
        <p>
          Learn differences between relational and non-relational databases, schema design, normalization, 
          denormalization, and how to choose the right database for your system.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/ruz-vK8IesE"
            title="SQL vs NoSQL Explained"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/1Ju5_PLDarg"
            title="Database Design Concepts"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>📘 Resources:</h3>
          <ul>
            <li><a href="https://www.geeksforgeeks.org/sql-vs-nosql/" target="_blank">SQL vs NoSQL GFG</a></li>
            <li><a href="https://www.mongodb.com/nosql-explained" target="_blank">MongoDB NoSQL Guide</a></li>
            <li><a href="https://dev.mysql.com/doc/" target="_blank">MySQL Documentation</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 4 - Sharding & Query Optimization */}
      <section className="tutorial-section">
        <h2><FaProjectDiagram className="icon"/> 4️⃣ Sharding, Indexing & Query Optimization</h2>
        <p>
          Explore database scaling techniques, indexing strategies, query optimization, and how to improve 
          database performance in production systems.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/XP98YCr-iXQ"
            title="What is Database Sharding?"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/eQ3eNd5WbH8"
            title="How Indexes Work in Distributed Databases"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🔧 Learning Links:</h3>
          <ul>
            <li><a href="https://www.mongodb.com/docs/manual/sharding/" target="_blank">MongoDB Sharding Docs</a></li>
            <li><a href="https://www.postgresql.org/docs/current/indexes.html" target="_blank">PostgreSQL Indexing</a></li>
            <li><a href="https://use-the-index-luke.com/" target="_blank">Query Optimization Guide</a></li>
          </ul>
        </div>
      </section>

      {/* SECTION 5 - System Design Interview Prep */}
      <section className="tutorial-section">
        <h2><FaServer className="icon"/> 5️⃣ System Design for Interview Preparation</h2>
        <p>
          Prepare for technical interviews by learning how to approach system design problems, 
          design scalable solutions, and communicate your architectural decisions effectively.
        </p>

        <div className="video-grid">
          <iframe
            src="https://www.youtube.com/embed/i7twT3x5yv8"
            title="System Design Interview: A Step-By-Step Guide"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/tj0NvyGNs3E"
            title="System Design Patterns"
            allowFullScreen
          ></iframe>
        </div>

        <div className="resources">
          <h3>🛠️ Resources:</h3>
          <ul>
            <li><a href="https://github.com/donnemartin/system-design-primer" target="_blank">System Design Primer</a></li>
            <li><a href="https://www.educative.io/courses/grokking-the-system-design-interview" target="_blank">Grokking System Design</a></li>
            <li><a href="https://www.geeksforgeeks.org/system-design-tutorials/" target="_blank">GeeksforGeeks System Design</a></li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <p>🚀 Keep practicing system design — mastery comes with hands-on learning!</p>
      </footer>
    </div>
  );
}
