// src/components/practice/CodingPractice.jsx

import React, { useState } from 'react';
import axios from 'axios';
// import syntax highlighter component library (e.g., CodeMirror) here later

const CodingPractice = () => {
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState("Python");
    const [difficulty, setDifficulty] = useState("Medium");
    const [challenge, setChallenge] = useState(null);
    const [userCode, setUserCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEvaluating, setIsEvaluating] = useState(false); // New state
    const [evaluationResult, setEvaluationResult] = useState(null); // New state

    const handleGenerateChallenge = async () => {
        if (!topic) {
            setError("Please enter a topic for the coding challenge.");
            return;
        }
        setError("");
        setLoading(true);
        setChallenge(null);
        setUserCode("");
        setEvaluationResult(null); // Reset evaluation on new challenge

        try {
            const response = await axios.post("http://localhost:5000/api/coding/generate-coding-challenge", {
                topic, language, difficulty,
            });

            setChallenge(response.data.challenge);
            setUserCode(response.data.challenge.starterCode || "");
            
        } catch (err) {
            console.error("Challenge Generation Error:", err);
            const errorMessage = err.response?.data?.message || "Failed to generate coding challenge.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // NEW FUNCTION: Handles submission for evaluation
    const handleSubmitCode = async () => {
        if (!userCode.trim()) {
            setError("Please write some code before submitting.");
            return;
        }
        setError("");
        setIsEvaluating(true);
        setEvaluationResult(null);

        try {
            const response = await axios.post("http://localhost:5000/api/coding/evaluate-code", {
                challenge: challenge,
                userCode: userCode,
                language: language,
            });

            setEvaluationResult(response.data.evaluation);

        } catch (err) {
            console.error("Code Evaluation Error:", err);
            const errorMessage = err.response?.data?.message || "Failed to evaluate code. Check server logs.";
            setError(errorMessage);
        } finally {
            setIsEvaluating(false);
        }
    };

    // --- Render Logic ---
    return (
        <div className="coding-practice-container">
            <h3>Generate a Coding Challenge</h3>
            
            <div className="quiz-form">
                {/* Omitted input controls (Language, Difficulty, Topic) for brevity, but they remain here */}
                {/* ... */}
                <select value={language} onChange={(e) => setLanguage(e.target.value)}><option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option></select>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select>
                <input type="text" placeholder="e.g., Arrays, Recursion, Trees" value={topic} onChange={(e) => setTopic(e.target.value)} />

                <button onClick={handleGenerateChallenge} disabled={loading}>
                    {loading ? "Generating Challenge..." : "Generate Challenge"}
                </button>

                {error && <p className="error">{error}</p>}
            </div>
            
            {challenge && (
                <div className="challenge-area">
                    {/* Problem Description Panel */}
                    <div className="challenge-problem">
                        <h4>{challenge.title}</h4>
                        <p><strong>Problem:</strong> {challenge.description}</p>
                        <p><strong>Constraints:</strong> {challenge.constraints}</p>
                        
                        <div className="example-block">
                            <h5>Example:</h5>
                            <p>Input: <code>{challenge.exampleInput}</code></p>
                            <p>Output: <code>{challenge.exampleOutput}</code></p>
                        </div>
                    </div>
                    
                    {/* Code Editor Panel */}
                    <div className="challenge-editor">
                        <h4>Your Solution ({language})</h4>
                        <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            rows="15"
                            placeholder={`Write your ${language} code here...`}
                        />
                        
                        <button 
                            onClick={handleSubmitCode}
                            disabled={isEvaluating}
                            className="submit-code-button"
                        >
                            {isEvaluating ? "Evaluating..." : "Submit Code for Evaluation"}
                        </button>
                    </div>

                    {/* NEW: Evaluation Results Display */}
                    {evaluationResult && (
                        <div className={`evaluation-result ${evaluationResult.isCorrect ? 'correct' : 'wrong'}`}>
                            <h5>
                                {evaluationResult.isCorrect ? '✅ Code Accepted!' : '❌ Code Failed Test:'}
                            </h5>
                            <p>{evaluationResult.feedback}</p>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default CodingPractice;