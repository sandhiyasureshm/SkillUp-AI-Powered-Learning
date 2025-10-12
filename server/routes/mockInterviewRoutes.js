const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
// Set a higher timeout globally for all Gemini requests to prevent "socket hang up"
const AXIOS_CONFIG = {
    timeout: 30000 
};
const BASE_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


// ==================================================================
// 🔥 ULTIMATE UTILITY FUNCTION: SAFELY PARSE JSON (Updated)
// ==================================================================
const safelyParseJson = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error("Input text is empty or invalid.");
  }

  // 1. Remove Markdown code fences like ```json ... ```
  let jsonString = text.replace(/```json|```/g, '').trim();

  // 2. Find the first { or [ and cut everything before it (removes chatty preamble)
  const firstBrace = jsonString.search(/[{\[]/);
  if (firstBrace > 0) {
    jsonString = jsonString.substring(firstBrace).trim();
  }

  if (!jsonString) {
    throw new Error("Content is empty after cleaning.");
  }

  // 3. Remove illegal control characters (not normal spaces!)
  jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // 4. Try parsing safely
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON parse failed. Raw string:", jsonString);
    throw err;
  }
};
// ------------------------------------------------------------------
// 1. ROUTE TO GENERATE INTERVIEW QUESTIONS
// ------------------------------------------------------------------
router.post("/generate-interview", async (req, res) => {
    const { role, numQuestions = 5 } = req.body;

    if (!role) {
        return res.status(400).json({ message: "Role is required to generate interview questions." });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Gemini API key not configured." });
        }

        const prompt = `You are a Senior Interviewer. Generate ${numQuestions} behavioral and technical interview questions for a candidate applying for the role of '${role}'.
Return ONLY a valid JSON object containing a 'questions' array. Each question object MUST include:
1. "id": A unique ID (integer starting from 1).
2. "text": The full question text.
3. "ideal_answer": A brief, ideal point-by-point answer for evaluation criteria.
4. "category": The type of question (e.g., 'Technical', 'Behavioral', 'Situational').`;

        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            },
            AXIOS_CONFIG // 🔥 ADDED TIMEOUT HERE
        );

        const responseBody = response.data;
        let textContent = responseBody?.candidates?.[0]?.content?.parts?.[0]?.text;

        // 🔥 CRITICAL CHECK: If generation failed or was blocked
        if (!textContent) {
            const blockReason = responseBody?.promptFeedback?.blockReason || 
                               responseBody?.candidates?.[0]?.finishReason;

            if (blockReason) {
                console.error("Gemini Content Generation Failed/Blocked:", blockReason);
                return res.status(500).json({ 
                    message: `AI content generation failed. Reason: ${blockReason}. Check your API Key or content policy.`,
                });
            }
            // If textContent is null/undefined but no clear blockReason, default to empty string for clean parse fail
            textContent = ""; 
        }

        let interviewData;
        try {
            interviewData = safelyParseJson(textContent); 
        } catch (e) {
            console.error("Failed to parse model's JSON response:", e.message);
            // Log the problematic text that failed to parse
            console.error("Problematic text (Generation):", textContent); 
            return res.status(500).json({ message: "Model response was not valid JSON." });
        }

        // Return the generated questions array
        res.status(200).json(interviewData.questions); 

    } catch (error) {
        console.error("Gemini API Error (Mock Interview Generation):", error.message);
        res.status(500).json({ message: "Failed to generate interview questions. Check server logs." });
    }
});


// ------------------------------------------------------------------
// 2. ROUTE TO EVALUATE USER'S ANSWER
// ------------------------------------------------------------------
router.post("/evaluate-answer", async (req, res) => {
    const { question, ideal_answer, user_answer, role, body_language_score } = req.body; 

    if (!question || !user_answer || !role) {
        return res.status(400).json({ message: "Missing required evaluation data." });
    }
    
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Gemini API key not configured." });
        }

        const prompt = `You are a critical interview judge. Evaluate the user's answer for the role of ${role}.
Question: "${question}"
Ideal Answer Points: "${ideal_answer}"

User's Answer (Transcript): "${user_answer}"
User's Observed Behavior/Body Language Score (from Camera): ${body_language_score}/10.

Use the provided body language score to influence the final 'score' and 'feedback'.
Simulate communication skills (clarity, conciseness) and domain knowledge (content accuracy). Provide a score out of 10.
Return ONLY a valid JSON object:
{
  "score": integer (out of 10),
  "feedback": "string (Detailed feedback on content, communication, and body language/behavior)",
  "communication_score": integer (out of 5, based on clarity, structure, and conciseness of the transcript),
  "body_language_score": ${body_language_score}, 
  "body_language_note": "Provide a specific note based on the ${body_language_score}/10 (e.g., 'Maintain eye contact' or 'Excellent posture observed')."
}`;

        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            },
            AXIOS_CONFIG
        );
        
        const responseBody = response.data;
        let textContent = responseBody?.candidates?.[0]?.content?.parts?.[0]?.text;

        // CRITICAL CHECK for content blocking
        if (!textContent) {
            const blockReason = responseBody?.promptFeedback?.blockReason || responseBody?.candidates?.[0]?.finishReason;
            if (blockReason) {
                return res.status(500).json({ message: `AI evaluation failed. Reason: ${blockReason}.` });
            }
            textContent = ""; 
        }

        let evaluation;
        try {
            evaluation = safelyParseJson(textContent); 
        } catch (e) {
            console.error("Failed to parse evaluation JSON:", e.message);
            console.error("Problematic text (Evaluation):", textContent); 
            return res.status(500).json({ message: "AI model failed to return valid JSON for evaluation." });
        }

        res.status(200).json({ evaluation });

    } catch (error) {
        console.error("Gemini API Error (Evaluate Answer):", error.message);
        res.status(500).json({ message: "Failed to evaluate answer. Check server logs." });
    }
});


// ------------------------------------------------------------------
// 3. ROUTE TO GENERATE FINAL REPORT
// ------------------------------------------------------------------
router.post("/generate-report", async (req, res) => {
    const { results, role } = req.body;
    
    if (!results || !role) {
        return res.status(400).json({ message: "Missing results or role for final report." });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Gemini API key not configured." });
        }
        
        const resultsSummary = JSON.stringify(results, null, 2); 

        const prompt = `You are the final hiring manager. Based on the user's interview results for the role of ${role}, generate a comprehensive report.
The results are: ${resultsSummary}

The report MUST contain:
1. An overall score (e.g., 7.5/10) summarizing all aspects (technical, communication, behavior).
2. A breakdown of scores by key areas (Technical/Content, Communication/Clarity, and Body Language/Behavior).
3. A bulleted list of 3-5 key Strengths.
4. A bulleted list of 3-5 detailed areas for Improvement (including specific advice for their answers and observed behavior).
Format the entire output as professional Markdown for direct display.`;

        const response = await axios.post(
            `${BASE_ENDPOINT}?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            },
            AXIOS_CONFIG
        );
        
        const reportText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate report.";
        
        res.status(200).json({ report: reportText });

    } catch (error) {
        console.error("Gemini API Error (Generate Report):", error.message);
        res.status(500).json({ message: "Failed to generate final report. Check server logs." });
    }
});

module.exports = router;