import React from "react";
import "../../styles/Practice.css";

const ProgressTracker = ({ progress }) => {
  if (!progress) {
    return <p>No progress yet. Take quizzes to track your progress!</p>;
  }

  return (
    <div>
      <p>Total Quizzes Taken: {progress.totalQuizzes}</p>
      <p>Total Points: {progress.totalPoints}</p>
    </div>
  );
};

export default ProgressTracker;
