import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import CourseCategories from "../components/CourseCategories";
import ContentSection from "../components/ContentSection";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <NavBar />

      {/* Hero Section */}
      <HeroSection />
      

      {/* Carousel Section */}
      <Carousel />
<ContentSection />
      {/* Popular Course Categories Section */}
      <CourseCategories navigate={navigate} />
    </div>
  );
}
