// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Courses from './pages/Courses';
import InterestedCourses from './pages/InterestedCourses';
import CoursePage from './pages/CoursePage';
import JobsPage from './pages/JobsPage';
import PracticePage from './pages/PracticePage';
import TutorialsPage from './pages/TutorialsPage';
import FrontendTutorials from './pages/FrontendTutorials';
import BackendTutorials from './pages/BackendTutorials';
import SystemDesignTutorials from './pages/SystemDesignTutorials';
import FullstackTutorials from './pages/FullstackTutorials';
import ProfessionalSkillsTutorials from './pages/ProfessionalSkillsTutorials';
import GovtExamsHome from './pages/GovtExamsHome';
import CentralGovtExamsPage from './pages/CentralGovtExamsPage';
import StateGovtExamsPage from './pages/StateGovtExamsPage';
import ProfilePage from "./pages/ProfilePage";

// Practice components
import QuizForm from './components/practice/QuizForm';
import InterviewPractice from './components/practice/MockInterview';
import CodingPractice from './components/practice/CodingPractice';
import ResumeHub from './components/practice/ResumeHub';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/interested-courses" element={<InterestedCourses />} />
        <Route path="/course/:id" element={<CoursePage />} />

        <Route path="/jobs" element={<Navigate to="/jobs/fresher" replace />} />
        <Route path="/jobs/:category" element={<JobsPage />} />

        <Route path="/practice" element={<PracticePage />}>
          <Route path="quiz" element={<QuizForm />} />
          <Route path="coding" element={<CodingPractice />} />
          <Route path="mock-interviews" element={<InterviewPractice />} />
          <Route path="resume-builder" element={<ResumeHub />} />
          <Route index element={<p>Select a practice option above</p>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/tutorials/frontend-advanced" element={<FrontendTutorials />} />
        <Route path="/tutorials/backend-advanced" element={<BackendTutorials />} />
        <Route path="/tutorials/system-design-and-databases" element={<SystemDesignTutorials />} />
        <Route path="/tutorials/fullstack-projects" element={<FullstackTutorials />} />
        <Route path="/tutorials/other-professional-skills" element={<ProfessionalSkillsTutorials />} />

        <Route path="/govt-exams" element={<GovtExamsHome />} />
        <Route path="/govt-exams/central" element={<CentralGovtExamsPage />} />
        <Route path="/govt-exams/state" element={<StateGovtExamsPage />} />
        <Route path="/govt-exams/state/:state" element={<StateGovtExamsPage />} />

        {/* Updated Profile Route */}
     <Route path="/profile" element={<ProfilePage />} /> 

      </Routes>
    </Router>
  );
}

export default App;
