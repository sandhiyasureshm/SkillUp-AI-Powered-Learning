const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Corrected Endpoint for the free-tier Gemini API
const BASE_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ------------------------------------------------------------------
// 1. ROUTE TO GENERATE A CODING CHALLENGE
// ------------------------------------------------------------------
router.post("/generate-coding-challenge", async (req, res) => {
    const { language, difficulty, topic } = req.body;

    if (!language || !difficulty || !topic) {
        return res.status(400).json({ message: "Missing required fields: language, difficulty, or topic" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not set." });
        }
        
        // --- MISSING GENERATION LOGIC ADDED HERE ---
        const prompt = `Generate a single ${difficulty} coding challenge for ${language} focused on ${topic}.
Return ONLY a valid JSON object with the following structure:
{
  "title": "string",
  "description": "string (the full problem description)",
  "constraints": "string (e.g., time complexity, input size)",
  "exampleInput": "string",
  "exampleOutput": "string",
  "starterCode": "string (A complete, empty function/class for the user to start with)"
}`;

        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const textContent =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        let challenge;
        try {
            const jsonString = textContent.replace(/```json|```/g, '').trim();
            challenge = JSON.parse(jsonString); 
        } catch (e) {
            console.error("Failed to parse model's JSON response for challenge:", e);
            return res.status(500).json({
                message: "Model response was received but was not valid JSON for the challenge.",
                rawResponse: textContent
            });
        }

        res.status(200).json({ challenge });
        // --- END OF GENERATION LOGIC ---

    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error("Gemini API Error (Coding Challenge):", errorMessage);
        
        res.status(500).json({
            message: "Failed to generate coding challenge.",
            errorDetail: errorMessage,
        });
    }
});


// ------------------------------------------------------------------
// 2. ROUTE TO EVALUATE USER'S CODE
// ------------------------------------------------------------------
router.post("/evaluate-code", async (req, res) => {
    const { challenge, userCode, language } = req.body;

    if (!challenge || !userCode || !language) {
        return res.status(400).json({ message: "Missing challenge, user code, or language for evaluation." });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not set." });
        }
        
        const prompt = `You are an automated code judge. Evaluate the user's code based on the provided challenge details.

Challenge Title: ${challenge.title}
Problem Description: ${challenge.description}
Language: ${language}
Expected Output for Input '${challenge.exampleInput}': '${challenge.exampleOutput}'

User's Code:
---
${userCode}
---

Simulate the execution and check the logic. Respond ONLY with a single JSON object having these two fields:
1. "isCorrect": boolean (true if the code seems to solve the problem and pass the example test, false otherwise)
2. "feedback": string (A brief, professional explanation of why the code passed or failed, referencing the logic or the example output.)`;

        // 2. Call the Gemini API
        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        // 3. Robust JSON Parsing
        const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        let evaluation;
        try {
            const jsonString = textContent.replace(/```json|```/g, '').trim();
            evaluation = JSON.parse(jsonString); 
        } catch (e) {
            console.error("Failed to parse model's evaluation JSON:", e);
            return res.status(500).json({
                message: "Evaluation service failed to return valid JSON.",
                evaluation: { isCorrect: false, feedback: "Internal error: Failed to parse model evaluation response." }
            });
        }

        res.status(200).json({ evaluation });

    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error("Gemini API Error (Code Evaluation):", errorMessage);
        
        res.status(500).json({
            message: "Failed to communicate with evaluation service.",
            errorDetail: errorMessage,
        });
    }
});

// ------------------------------------------------------------------
// 3. EXPORT THE ROUTER (Only once)
// ------------------------------------------------------------------
module.exports = router;