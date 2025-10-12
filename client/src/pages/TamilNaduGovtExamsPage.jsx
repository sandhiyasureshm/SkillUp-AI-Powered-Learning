// TamilNaduGovtExamsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TamilNaduGovtExamsPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch exam data from an API or static file
    axios.get('/api/tn-govt-exams')
      .then(response => setExams(response.data))
      .catch(error => console.error('Error fetching exam data:', error));
  }, []);

  return (
    <div>
      <h1>Tamil Nadu Government Exams</h1>
      <ul>
        {exams.map((exam, index) => (
          <li key={index}>
            <h2>{exam.name}</h2>
            <p><strong>Eligibility:</strong> {exam.eligibility}</p>
            <p><strong>How to Apply:</strong> {exam.application}</p>
            <p><strong>Exam Date:</strong> {exam.date}</p>
            <p><strong>Syllabus:</strong> {exam.syllabus}</p>
            <p><strong>Pattern:</strong> {exam.pattern}</p>
            <a href={exam.link} target="_blank" rel="noopener noreferrer">Official Notification</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
