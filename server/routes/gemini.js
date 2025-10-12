const express = require("express");
// Removed GoogleAuth, as it's not needed for the free-tier API Key
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/generate-questions", async (req, res) => {
    const { topic, level, numQuestions } = req.body;

    if (!topic || !level || !numQuestions) {
        return res.status(400).json({ message: "Missing required fields: topic, level, or numQuestions" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not set in environment variables." });
        }
        
        // Corrected Endpoint for the free-tier Gemini API
        const BASE_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
        
        // Prompt for strict JSON output
        const prompt = `Generate ${numQuestions} ${level} programming quiz questions on ${topic}.
Return ONLY a valid JSON array with this structure:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string"
  }
]`;

        // --- CORRECTED AXIOS CALL ---
        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`, // API Key passed in the URL
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
                // ⚠️ FIX: The 'config' field that caused the 400 error is removed 
                // The model will now rely purely on the text prompt for JSON output.
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization header is not needed here
                },
            }
        );

        // Robust parsing of the model's text response
        const textContent =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        
        let questions;
        try {
            // Cleanup: remove markdown fences (```json...```) before parsing
            const jsonString = textContent.replace(/```json|```/g, '').trim();
            questions = JSON.parse(jsonString); 
        } catch (e) {
            console.error("Failed to parse model's JSON response:", e);
            // Return a specific error to the frontend
            return res.status(500).json({
                message: "Model response was received but was not valid JSON. Try regenerating.",
                rawResponse: textContent
            });
        }

        // Ensure the final result is an array
        if (!Array.isArray(questions)) {
             console.warn("Parsed object was not an array, wrapping it.");
             questions = [questions];
        }

        res.status(200).json({ questions });
    } catch (error) {
        // Consolidated error handling for API issues
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error("Gemini API Error:", errorMessage);
        
        res.status(500).json({
            message: "Failed to generate questions. API Key or rate limit issue.",
            errorDetail: errorMessage,
        });
    }
});

module.exports = router;