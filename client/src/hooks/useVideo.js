// src/hooks/useVideo.js

import { useRef, useState, useEffect } from 'react';

const useVideo = () => {
    // useRef to attach to the <video> element in MockInterview.jsx
    const videoRef = useRef(null);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [stream, setStream] = useState(null);

    // Function to start the camera stream
    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("Browser does not support MediaDevices or getUserMedia.");
            return;
        }

        try {
            // Request video stream only
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            
            // Attach the stream to the video element if the ref is available
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            
            setStream(mediaStream);
            setIsVideoOn(true);
        } catch (err) {
            console.error("Error accessing the camera:", err);
            setIsVideoOn(false);
            // Alert user if permission is denied
            alert("Camera access denied. Please grant camera permission to use the video feature.");
        }
    };

    // Function to stop the camera stream
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        setIsVideoOn(false);
    };

    // Toggle function for the button in the component
    const toggleVideo = () => {
        if (isVideoOn) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    // Cleanup effect: Stops the camera when the component unmounts
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Return necessary state and control functions
    return {
        videoRef,
        isVideoOn,
        startCamera, // Used to initially start the camera when interview begins
        toggleVideo, // Used for the manual on/off button
    };
};

export default useVideo;