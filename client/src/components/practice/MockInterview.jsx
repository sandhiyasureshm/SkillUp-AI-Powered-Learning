import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// Removed: import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'; 
// Removed: import "../../styles/mock.css"; 

// --- Polyfills/Setup for Browser Native APIs ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSynthesis = window.speechSynthesis;



const useVideo = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

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
            // Request both video and audio
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            }); 
            
            // Ensure tracks are enabled
            mediaStream.getVideoTracks().forEach(track => track.enabled = true);
            mediaStream.getAudioTracks().forEach(track => track.enabled = true);
            
            setStream(mediaStream);
            return mediaStream;
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
            // In case of error, stop everything
            if (stream) stopCamera(); 
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


    // EFFECT 1: Attach the stream to the video element whenever the stream changes
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // The video element must be explicitly told to play, and muted helps avoid autoplay issues
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
    // Note: 'stream' is used in the cleanup, so it must be a dependency.
    }, [stream]); 

    // --- RETURN STATEMENT ---
    return { videoRef, startCamera, stopCamera, stream, toggleTrack };
};


// =========================================================
// 2. Main Component: MockInterview
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

    // --- Native Speech Synthesis (TTS) State ---
    const [speaking, setSpeaking] = useState(false);
    const isTTSSupported = !!speechSynthesis;

    // --- Native Speech Recognition (STT) State ---
    const recognitionRef = useRef(null);
    const isSTTSupported = !!SpeechRecognition;

    const currentQuestion = questions[currentQIndex];

    // Initialize Speech Recognition on component mount
    useEffect(() => {
        if (isSTTSupported && !recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true; // Use continuous to capture long answers better
            recognition.interimResults = true; // Show interim results
            recognition.lang = 'en-US';

            // Store the recognition instance in a ref
            recognitionRef.current = recognition;

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                // Process all results from the event
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const result = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += result + ' ';
                    } else {
                        interimTranscript += result;
                    }
                }
                
                // When continuous is true, we update the state with the ongoing final transcript
                // We use a functional update to ensure we don't overwrite previous final sections
                setUserTranscript(prev => (prev + finalTranscript).trim());
            };
            
            recognition.onend = () => {
                // If onend fires, but listening state is still true, it means it stopped unexpectedly.
                if (isListening) {
                    setIsListening(false);
                }
            };
            
            recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error !== 'no-speech') {
                    setError("Microphone error. Please check permissions.");
                }
                setIsListening(false);
            };
        }
    }, [isSTTSupported, isListening]); // Dependency on isListening for cleanup logic consistency

    // Function to speak text using native TTS
    const speakText = useCallback((text) => {
        if (!isTTSSupported || !text) return;

        // Cancel any previous speech
        speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setSpeaking(false);
        };
        
        speechSynthesis.speak(utterance);
    }, [isTTSSupported]);

    // --- FUNCTION DEFINITIONS ---

    // Handler for the Video button
    const handleVideoToggle = () => {
        const newState = !isVideoOn;
        setIsVideoOn(newState);
        toggleTrack('video', newState); 
    };

    // Handler for the Mic button
    const handleMicToggle = () => {
        const newState = !isMicOn;
        setIsMicOn(newState);
        toggleTrack('audio', newState);
        // If mic is turned off, stop listening immediately
        if (!newState && isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Function to generate the final summary report
    const generateFinalReport = async (finalQuestions) => {
        setLoading(true);
        try {
            const reportResponse = await axios.post("https://skillup-ai-powered-learning-1.onrender.com/api/mock/generate-report", {
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
            const evaluationResponse = await axios.post("https://skillup-ai-powered-learning-1.onrender.com/api/mock/evaluate-answer", {
                question: currentQuestion.text,
                // Removed ideal_answer as it's not present in the questions structure and may cause API issues
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
        
        if (!isSTTSupported) {
             setError("Speech Recognition is not supported in this browser. Please use a supported browser.");
             return;
        }

        if (isListening) {
            // STOP recording and SUBMIT
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false); // Explicitly stop the listening state
            
            setTimeout(() => {
                if (userTranscript.trim()) {
                    // Simulate a random score change between 6 and 10
                    const simulatedScore = Math.floor(Math.random() * 5) + 6; 
                    setBodyLanguageScore(simulatedScore); // Update score visually
                    
                    evaluateAnswer(userTranscript, simulatedScore); 
                } else {
                    setError("Please speak your answer before stopping the recording.");
                }
            }, 50); 
            
        } else {
            // START recording
            setUserTranscript(''); 
            setIsListening(true);
            setError('');
            
            // CRITICAL: Stop the AI's voice immediately if it's speaking when user starts recording
            if (speechSynthesis.speaking) { 
                speechSynthesis.cancel();
            }
            
            if (recognitionRef.current) recognitionRef.current.start();
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
            const response = await axios.post("https://skillup-ai-powered-learning-1.onrender.com/api/mock/generate-interview", { role });
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

    // 🎯 FIX: Auto-speak the question when it changes (SYNCHRONIZATION)
    useEffect(() => {
        if (interviewStarted && currentQuestion && currentQuestion.text) {
            // Only speak if the AI is not currently speaking and the user is not trying to record
            if (!speaking && !isListening) { 
                speakText(currentQuestion.text);
            }
        } else if (report) {
            // Speak only if report state is set and AI is not already talking
            if (!speaking) {
                speakText("The interview is complete. Preparing your final feedback report now.");
            }
        }
        
    // Dependencies: currentQuestion?.text triggers speaking for new question;
    // speaking/isListening ensures we don't interrupt.
    }, [currentQIndex, interviewStarted, report, speaking, isListening, currentQuestion?.text, speakText]); 


    // --- RENDER LOGIC ---

    // Utility Tailwind class for common button styles
    const buttonBaseClasses = "px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center";
    const primaryButtonClasses = `${buttonBaseClasses} bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed`;
    const secondaryButtonClasses = `${buttonBaseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;


    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white rounded-xl shadow-lg text-lg font-medium text-indigo-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {report ? 'Generating Final Report...' : 'Loading Interview Questions...'}
            </div>
        </div>
    );
    
    if (!interviewStarted) {
        // Interview Setup View
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Start Your Mock Interview</h3>
                    <p className="text-gray-600 mb-6">Enter the job role or topic you want to be interviewed for.</p>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="E.g., Senior Frontend Developer, Data Analyst"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button onClick={startInterview} className={primaryButtonClasses + " w-full"}>
                        Start Interview
                    </button>
                    {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                    {!isTTSSupported && <p className="text-yellow-600 mt-3 text-sm">⚠️ Voice output (TTS) is not fully supported in this browser.</p>}
                    {!isSTTSupported && <p className="text-red-600 mt-3 text-sm">🛑 Voice input (STT) is not fully supported in this browser.</p>}
                </div>
            </div>
        );
    }
    
    // Interview in Progress View
    if (interviewStarted && !report) {
        const prevQuestionIndex = currentQIndex > 0 ? currentQIndex - 1 : null;
        const prevEvaluation = prevQuestionIndex !== null ? questions[prevQuestionIndex].evaluation : null;

        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex flex-col items-center">
                <div className="w-full max-w-6xl space-y-8">
                    
                    {/* 1. Video/Avatar Section (Two Cameras) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Placeholder for the Professional AI Interviewer Avatar */}
                        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-4 border-indigo-200">
                            <p className="text-lg font-semibold text-indigo-700 mb-2">👤 AI Interviewer ({role})</p>
                            <div className="w-full max-w-sm aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <p className="text-gray-500 text-center">Professional AI Avatar Here</p>
                                {speaking && (
                                    <span className="absolute bottom-2 left-2 px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full animate-pulse shadow-lg">
                                        ... Speaking
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User's Camera Box */}
                        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-4 border-green-200 relative">
                            <p className="text-lg font-semibold text-green-700 mb-2">Your Video Feed</p>
                            <div className='w-full max-w-sm aspect-video relative'>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className={`w-full h-full rounded-lg object-cover transition-opacity duration-300 ${isVideoOn ? 'opacity-100' : 'opacity-0'}`}
                                />
                                {/* Show placeholder when video is manually off or stream is unavailable */}
                                {(!stream || !isVideoOn) && (
                                    <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center transition-opacity duration-300">
                                        <span className='text-white font-medium'>Camera Off / Feed Unavailable</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Media Controls Box */}
                            <div className="flex space-x-4 mt-4">
                                <button onClick={handleMicToggle} className={`${secondaryButtonClasses} ${isMicOn ? 'text-green-600 border-2 border-green-400' : 'text-red-600 border-2 border-red-400'}`}>
                                    {isMicOn ? '🎤 Mic On' : '🔇 Mute'}
                                </button>
                                <button onClick={handleVideoToggle} className={`${secondaryButtonClasses} ${isVideoOn ? 'text-green-600 border-2 border-green-400' : 'text-red-600 border-2 border-red-400'}`}>
                                    {isVideoOn ? '📹 Video On' : '📷 Video Off'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* 2. Question and Control Panel */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-indigo-500">
                        <h4 className="text-xl font-bold text-gray-700 mb-4">
                            Question {currentQIndex + 1} of {questions.length} 
                            <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                {currentQuestion.category}
                            </span>
                        </h4>
                        <p className="text-2xl font-light text-gray-900 mb-6 border-b pb-4">{currentQuestion.text}</p>

                        <div className="mic-control flex flex-col space-y-4">
                            <button 
                                onClick={toggleListening}
                                disabled={loading || !isMicOn || speaking} 
                                className={`${buttonBaseClasses} w-full sm:w-auto self-start ${
                                    isListening 
                                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                                    : (speaking ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700')
                                }`}
                            >
                                {isListening ? '🔴 Stop Recording & Submit' : (speaking ? '... Waiting for AI' : '🎤 Start Answering')}
                            </button>
                            
                            {!isMicOn && <p className="text-red-500 text-sm">Turn on your microphone to start recording.</p>}
                            
                            <p className="text-gray-700 border-t pt-4">
                                <strong>Your Answer:</strong> 
                                <span className="ml-2 font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded-md block mt-2 min-h-[40px] whitespace-pre-wrap">
                                    {userTranscript || (isListening ? "Listening..." : (speaking ? "Waiting for question to finish..." : "Click 'Start Answering' to speak."))}
                                </span>
                            </p>
                            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                        </div>

                        {/* Display previous question's evaluation */}
                        {prevEvaluation && (
                            <div className="mt-8 p-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-inner">
                                <h5 className="text-lg font-bold text-yellow-800 mb-3">Feedback on Q{prevQuestionIndex + 1}:</h5>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><strong>Overall Score:</strong> <span className='font-bold text-base text-yellow-900'>{prevEvaluation.score}/10</span></p>
                                    <p><strong>Communication Score:</strong> <span className='font-bold'>{prevEvaluation.communication_score}/5</span></p>
                                    <p><strong>Behavior Score:</strong> <span className='font-bold'>{prevEvaluation.body_language_score || 'N/A'}/10</span></p>
                                    <p><strong>Feedback:</strong> {prevEvaluation.feedback}</p>
                                    <p><strong>Body Language Note:</strong> {prevEvaluation.body_language_note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Final Report View
    if (report) {
        // stopCamera is called when generateFinalReport is triggered
        return (
            <div className="min-h-screen flex items-start justify-center bg-gray-100 p-8">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl border-t-8 border-indigo-600">
                    <h3 className="text-3xl font-bold text-indigo-700 mb-4 border-b pb-2">Final Interview Report for {role}</h3>
                    <div className="text-gray-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: report }} /> 
                    <button 
                        onClick={() => window.location.reload()}
                        className={primaryButtonClasses + " mt-8"}
                    >
                        Start New Interview
                    </button>
                </div>
            </div>
        );
    }
};

export default MockInterview;
