import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'; 
import "../../styles/mock.css"; 

// =========================================================
// 1. Custom Hook: useVideo (Handles Camera/Mic Stream)
//    - Corrected function order and dependency arrays.
// =========================================================

const useVideo = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    // --- FUNCTION DEFINITIONS (Must come first) ---
    
    // Stop all media tracks and clear the stream state
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
    
    // Start camera and microphone access
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            }); 
            
            // Ensure tracks are enabled upon starting (important for some browsers)
            mediaStream.getVideoTracks().forEach(track => track.enabled = true);
            mediaStream.getAudioTracks().forEach(track => track.enabled = true);
            
            setStream(mediaStream);
            return mediaStream;
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
            setStream(null); 
            return null;
        }
    };

    // Toggle a specific track (video or audio) on/off
    const toggleTrack = (kind, enable) => {
        if (stream) {
            stream.getTracks().forEach(track => {
                if (track.kind === kind) {
                    track.enabled = enable;
                }
            });
        }
    };


    // --- USE EFFECTS ---
    
    // EFFECT 1: Attach the stream to the video element whenever the stream changes
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // Attempt to play explicitly to ensure the feed is visible
            videoRef.current.play().catch(e => console.log("Video Play Error:", e));
        }
    }, [stream]); 

    // EFFECT 2: Cleanup - Stop the camera when the component unmounts
    useEffect(() => {
        return () => {
            // Cleanly stop tracks if the component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]); // Dependency on stream is needed for cleanup to work on the correct stream

    // --- RETURN STATEMENT ---
    return { videoRef, startCamera, stopCamera, stream, toggleTrack };
};


// =========================================================
// 2. Main Component: MockInterview
//    - Corrected function order to resolve ReferenceErrors.
// =========================================================

const MockInterview = () => {
    const [role, setRole] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Video/Camera hooks
    const { videoRef, startCamera, stopCamera, stream, toggleTrack } = useVideo();
    const [bodyLanguageScore, setBodyLanguageScore] = useState(10); 
    
    // State for Media Controls
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    // Voice Synthesis for Avatar (Interviewer)
    const { speak, speaking, supported } = useSpeechSynthesis();
    
    // Voice Recognition for User (Candidate)
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result) => {
            setUserTranscript(result); 
        },
        onEnd: () => {
            setIsListening(false);
        },
        onError: (e) => {
            console.error("Speech Recognition Error:", e);
            // Only set error if it's not a generic no-speech error
            if (e.error !== 'no-speech') {
                 setError("Microphone error. Please check permissions.");
            }
            setIsListening(false);
        }
    });

    const currentQuestion = questions[currentQIndex];


    // --- FUNCTION DEFINITIONS (All handlers must be defined here) ---

    // Handler for the Video button
    const handleVideoToggle = () => {
        const newState = !isVideoOn;
        setIsVideoOn(newState);
        toggleTrack('video', newState); 
        
        // If turning ON, explicitly try to play the video element
        if (newState && videoRef.current) {
            videoRef.current.play().catch(e => console.log("Play on Toggle Error:", e));
        }
    };

    // Handler for the Mic button
    const handleMicToggle = () => {
        const newState = !isMicOn;
        setIsMicOn(newState);
        toggleTrack('audio', newState);
    };

    // Function to generate the final summary report
    const generateFinalReport = async (finalQuestions) => {
        setLoading(true);
        try {
            const reportResponse = await axios.post("http://localhost:5000/api/mock/generate-report", {
                results: finalQuestions.map(q => ({
                    question: q.text,
                    category: q.category,
                    evaluation: q.evaluation
                })),
                role: role
            });
            setReport(reportResponse.data.report);
        } catch (err) {
            setError("Failed to generate final report.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Function to evaluate the user's answer
    const evaluateAnswer = async (answer, behaviorScore) => { 
        setLoading(true);
        setIsListening(false); 
        
        try {
            const evaluationResponse = await axios.post("http://localhost:5000/api/mock/evaluate-answer", {
                question: currentQuestion.text,
                ideal_answer: currentQuestion.ideal_answer,
                user_answer: answer,
                role: role,
                body_language_score: behaviorScore 
            });

            // Store the evaluation for this question
            const newQuestions = [...questions];
            newQuestions[currentQIndex].evaluation = evaluationResponse.data.evaluation;
            setQuestions(newQuestions);

            // Move to the next question or finish
            if (currentQIndex < questions.length - 1) {
                setError('');
                setCurrentQIndex(currentQIndex + 1);
            } else {
                stopCamera(); 
                generateFinalReport(newQuestions); 
            }

        } catch (err) {
            setError("Failed to evaluate answer. Check server status.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle the start/stop of user recording
    const toggleListening = () => {
        if (!isMicOn) {
            setError("Microphone is off. Please turn it on to record your answer.");
            return;
        }
        
        if (listening) {
            // STOP recording and SUBMIT
            stop(); 
            
            setTimeout(() => {
                if (userTranscript.trim()) {
                    // Simulate a random score change between 6 and 10
                    const simulatedScore = Math.floor(Math.random() * 5) + 6; 
                    setBodyLanguageScore(simulatedScore); 
                    
                    evaluateAnswer(userTranscript, simulatedScore); 
                } else {
                    setIsListening(false);
                    setError("Please speak your answer before stopping the recording.");
                }
            }, 50); 
            
        } else {
            // START recording
            setUserTranscript(''); 
            setIsListening(true);
            setError('');
            
            // Immediately stop the AI's voice if it's speaking
            if (window.speechSynthesis.speaking) { 
                 window.speechSynthesis.cancel();
            }
            
            listen({ lang: 'en-US' }); 
        }
    };
    
    // Function to generate the interview questions
    const startInterview = async () => {
        if (!role.trim()) {
            setError("Please enter a role/topic to begin.");
            return;
        }
        setLoading(true);
        setError('');
        setReport(null);
        setQuestions([]);
        setCurrentQIndex(0);
        
        // Start camera and microphone access
        const streamResult = await startCamera(); 

        if (!streamResult) {
            setError("Could not access camera/microphone. Please ensure permissions are granted.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/mock/generate-interview", { role });
            setQuestions(response.data);
            setInterviewStarted(true);
        } catch (err) {
            setError("Failed to generate interview. Check API key and server.");
            stopCamera(); // Stop camera on failure
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-speak the question when it changes (SYNCHRONIZATION)
    useEffect(() => {
        if (interviewStarted && currentQuestion) {
            if (!speaking && !listening) { 
                // Use a slight delay to ensure the button has been enabled
                setTimeout(() => {
                    if (!speaking) {
                        speak({ text: currentQuestion.text });
                    }
                }, 500);
            }
        } else if (report) {
            speak({ text: "The interview is complete. Preparing your final feedback report now." });
        }
        
    }, [currentQIndex, interviewStarted, report, speak, speaking, listening]); 


    // --- RENDER LOGIC ---

    if (loading) return <div className="loading-message">Loading... Please wait for the AI Interviewer.</div>;
    
    if (!interviewStarted) {
        // Interview Setup View
        return (
            <div className="interview-setup">
                <h3>Start Your Mock Interview</h3>
                <p>Enter the job role or topic you want to be interviewed for.</p>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="E.g., Senior Frontend Developer, Data Analyst"
                />
                <button onClick={startInterview} disabled={loading}>
                    Start Interview
                </button>
                {error && <p className="error">{error}</p>}
                {!supported && <p className="warning">⚠️ Voice output is not fully supported in this browser.</p>}
            </div>
        );
    }
    
    // Interview in Progress View
    if (interviewStarted && !report) {
        const prevQuestionIndex = currentQIndex > 0 ? currentQIndex - 1 : null;
        const prevEvaluation = prevQuestionIndex !== null ? questions[prevQuestionIndex].evaluation : null;

        return (
            <div className="mock-interview-session">
                
                {/* 1. Video/Avatar Section (Two Cameras) */}
                <div className="avatar-section">
                    
                    {/* Placeholder for the Professional AI Interviewer Avatar */}
                    <div className="interviewer-placeholder">
                        <p>👤 AI Interviewer ({role})</p>
                        {speaking && <span className="speaking-indicator">... Speaking</span>}
                        <div style={{ height: '200px', width: '300px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>Professional AI Avatar Here</p>
                        </div>
                    </div>

                    {/* User's Camera Box */}
                    <div className="user-video-container">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="user-webcam-feed"
                            style={{ display: isVideoOn ? 'block' : 'none' }}
                        />
                        {/* Show placeholder when video is manually off or stream is unavailable */}
                        {(!stream || !isVideoOn) && <div className="no-camera-message">Camera Off / Feed Unavailable</div>}
                        
                        <p className="camera-label">Your Video Feed</p>
                        
                        {/* Media Controls Box */}
                        <div className="media-controls-box">
                            <button onClick={handleMicToggle} className={isMicOn ? 'active' : 'inactive'}>
                                {isMicOn ? '🎤 Mic On' : '🔇 Mute'}
                            </button>
                            <button onClick={handleVideoToggle} className={isVideoOn ? 'active' : 'inactive'}>
                                {isVideoOn ? '📹 Video On' : '📷 Video Off'}
                            </button>
                        </div>
                    </div>

                </div>
                
                {/* 2. Question and Control Panel */}
                <div className="question-panel">
                    <h4>Question {currentQIndex + 1} of {questions.length} ({currentQuestion.category})</h4>
                    <p className="question-text">{currentQuestion.text}</p>

                    <div className="mic-control">
                        <button 
                            onClick={toggleListening}
                            disabled={loading || !isMicOn || speaking} 
                            className={listening ? 'mic-active' : ''}
                        >
                            {listening ? '🔴 Stop Recording & Submit' : (speaking ? '... Please Wait' : '🎤 Start Answering')}
                        </button>
                        {
                            !isMicOn && 
                            <p className="error-small">Turn on your microphone to start recording.</p>
                        }

                        <p className="transcript">
                            <strong>Your Answer:</strong> {userTranscript || (listening ? "Listening..." : "Click 'Start Answering' to speak.")}
                        </p>
                        {error && <p className="error">{error}</p>}
                    </div>

                    {/* Display previous question's evaluation */}
                    {prevEvaluation && (
                        <div className="prev-evaluation">
                            <h5>Feedback on Q{prevQuestionIndex + 1}:</h5>
                            <p><strong>Overall Score:</strong> {prevEvaluation.score}/10</p>
                            <p><strong>Communication Score:</strong> {prevEvaluation.communication_score}/5</p>
                            <p><strong>Behavior Score:</strong> {prevEvaluation.body_language_score || 'N/A'}/10</p>
                            <p><strong>Feedback:</strong> {prevEvaluation.feedback}</p>
                            <p><strong>Body Language Note:</strong> {prevEvaluation.body_language_note}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Final Report View
    if (report) {
        // stopCamera is called when generateFinalReport is triggered
        return (
            <div className="interview-report">
                <h3>Final Interview Report for {role}</h3>
                <div dangerouslySetInnerHTML={{ __html: report }} /> 
                <button onClick={() => window.location.reload()}>Start New Interview</button>
            </div>
        );
    }
};

export default MockInterview;