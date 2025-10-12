import React, { useState } from "react";
import axios from "axios";
import "../../styles/Practice.css";

const QuizForm = () => {
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("Easy");
    const [numQuestions, setNumQuestions] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    const handleGenerate = async () => {
        if (!topic) {
            setError("Please enter a topic");
            return;
        }
        setError("");
        setLoading(true);
        setScore(null);
        setAnswers({});

        try {
            const response = await axios.post("https://skillup-ai-powered-learning-1.onrender.com/api/generate-questions", {
                topic,
                level,
                numQuestions: parseInt(numQuestions)
            });

            let generatedQuestions = response.data.questions;
            
            if (!Array.isArray(generatedQuestions)) {
                if (generatedQuestions && typeof generatedQuestions === 'object') {
                    generatedQuestions = [generatedQuestions];
                } else {
                    generatedQuestions = []; 
                }
            }
            setQuestions(generatedQuestions);

        } catch (err) {
            console.error(err);
            
            const errorMessage = err.response?.data?.message || "Failed to generate questions. Check server logs for details.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = (qIndex, option) => {
        // Prevent changing answers after submission
        if (score === null) { 
            setAnswers({ ...answers, [qIndex]: option });
        }
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] && q.answer && answers[idx] === q.answer) correct++;
        });
        setScore(correct);
    };

    const isSubmitted = score !== null; // Helper variable

    return (
        <div className="practice-root">
            <h2>Generate Quiz Questions</h2>

            {/* ... (omitted quiz form inputs) */}
            <div className="quiz-form">
                <label>Topic:</label>
                <input
                    type="text"
                    placeholder="Enter topic (e.g., React, Python)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />

                <label>Level:</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>

                <label>Number of Questions:</label>
                <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                />

                <button onClick={handleGenerate} disabled={loading}>
                    {loading ? "Generating..." : "Generate Questions"}
                </button>

                {error && <p className="error">{error}</p>}
            </div>
            {/* ... (omitted quiz form inputs) */}

            {questions.length > 0 && (
                <div className="questions-container">
                    <h3>Generated Questions:</h3>
                    {questions.map((q, idx) => {
                        const isCorrect = answers[idx] === q.answer;
                        const userSelected = answers[idx];

                        return (
                            <div 
                                key={idx} 
                                className={`question-card ${isSubmitted ? (isCorrect ? 'correct-answer-card' : 'wrong-answer-card') : ''}`}
                            >
                                <p>
                                    <strong>{idx + 1}. {q.question || "Question missing text"}</strong>
                                </p>
                                
                                {q.options && Array.isArray(q.options) && (
                                    <ul>
                                        {q.options.map((opt, i) => {
                                            const isOptionCorrect = opt === q.answer;
                                            const isOptionSelected = opt === userSelected;
                                            
                                            // Determine the class to apply to the label
                                            let optionClass = '';
                                            if (isSubmitted) {
                                                if (isOptionCorrect) {
                                                    optionClass = 'correct-option';
                                                } else if (isOptionSelected && !isOptionCorrect) {
                                                    optionClass = 'wrong-option';
                                                }
                                            } else if (isOptionSelected) {
                                                optionClass = 'selected-option'; // Highlight before submit
                                            }

                                            return (
                                                <li key={i}>
                                                    <label 
                                                        className={optionClass}
                                                        // Disable radio buttons after submission
                                                        style={isSubmitted ? {pointerEvents: 'none'} : {}}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${idx}`}
                                                            value={opt}
                                                            checked={isOptionSelected}
                                                            onChange={() => handleSelectAnswer(idx, opt)}
                                                            disabled={isSubmitted} // Disable after submit
                                                        />
                                                        {opt}
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                
                                {/* ANSWER REVEAL LOGIC */}
                                {isSubmitted && (
                                    <p className={`answer-reveal ${isCorrect ? 'correct' : 'wrong'}`}>
                                        {isCorrect ? '✅ Correct!' : `❌ Incorrect.`} The correct answer is: <strong>{q.answer}</strong>
                                    </p>
                                )}

                                {(!q.options || !Array.isArray(q.options)) && (
                                    <p className="error">**Error:** Options are missing or malformed for this question.</p>
                                )}
                            </div>
                        );
                    })}

                    <button 
                        onClick={handleSubmit} 
                        style={{ marginTop: "20px" }}
                        disabled={isSubmitted} // Disable submit button after first submission
                    >
                        {isSubmitted ? "Quiz Submitted" : "Submit Quiz"}
                    </button>

                    {score !== null && (
                        <h3 style={{ marginTop: "20px" }}>Your Score: {score} / {questions.length}</h3>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizForm;
