// server/routes/practice.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const PracticeQuiz = require('../models/PracticeQuiz');
const CodingProblem = require('../models/CodingProblem');
const MockQuestion = require('../models/MockQuestion');
const PracticeProgress = require('../models/PracticeProgress');

const router = express.Router();

/* -------------------------
   Utilities
   ------------------------- */
function parseJsonBestEffort(text) {
  if (!text) return null;
  try { return JSON.parse(text); }
  catch (e) {
    // try to extract JSON substring
    const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (e2) { return null; }
    }
    return null;
  }
}

/* -------------------------
   DEV: Seed endpoint
   ------------------------- */
router.post('/seed', async (req, res) => {
  try {
    // seed quizzes
    const existing = await PracticeQuiz.findOne({ topic: 'DSA' });
    if (!existing) {
      await PracticeQuiz.create({
        topic: 'DSA',
        questions: [
          { question: 'Time complexity of binary search?', options: ['O(n)','O(log n)','O(n log n)','O(1)'], correctIndex: 1 },
          { question: 'Which DS is used for BFS?', options: ['Stack','Queue','Heap','Tree'], correctIndex: 1 }
        ]
      });
    }

    // seed coding problem
    const count = await CodingProblem.countDocuments();
    if (!count) {
      await CodingProblem.create({
        title: 'Sum of two numbers',
        difficulty: 'Easy',
        description: 'Given two integers separated by space, output their sum.',
        sampleInput: '2 3',
        sampleOutput: '5'
      });
    }

    // seed mock question
    const mq = await MockQuestion.findOne();
    if (!mq) {
      await MockQuestion.create({
        techstack: 'General',
        role: 'frontend',
        question: 'Explain the virtual DOM.',
        hint: 'Talk about diffing and minimal DOM updates',
        sampleAnswer: 'Virtual DOM is a lightweight representation of the real DOM...'
      });
    }

    res.json({ message: 'seeded' });
  } catch (err) {
    console.error('seed err', err);
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------
   QUIZZES
   GET /api/practice/quizzes?topic=DSA
   ------------------------- */
router.get('/quizzes', async (req, res) => {
  try {
    const { topic } = req.query;
    if (!topic) return res.status(400).json({ message: 'topic required' });
    const quiz = await PracticeQuiz.findOne({ topic });
    if (!quiz) return res.status(404).json({ message: 'not found' });
    const safe = quiz.questions.map(q => ({ _id: q._id, question: q.question, options: q.options }));
    res.json({ topic: quiz.topic, questions: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* Submit quiz */
router.post('/quizzes/submit', async (req, res) => {
  try {
    const { userId, topic, answers } = req.body;
    const quiz = await PracticeQuiz.findOne({ topic });
    if (!quiz) return res.status(404).json({ message: 'not found' });
    let score = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctIndex) score++; });
    if (userId) {
      await PracticeProgress.findOneAndUpdate({ userId }, { $inc: { quizzesAttempted: 1 } }, { upsert: true });
    }
    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------
   CODING
   GET /api/practice/coding/problems
   ------------------------- */
router.get('/coding/problems', async (req, res) => {
  try {
    const problems = await CodingProblem.find({});
    res.json(problems);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* POST /api/practice/coding/check  body: { userId, problemId, userOutput } */
router.post('/coding/check', async (req, res) => {
  try {
    const { userId, problemId, userOutput } = req.body;
    const p = await CodingProblem.findById(problemId);
    if (!p) return res.status(404).json({ message: 'not found' });
    const ok = (p.sampleOutput || '').trim() === (userOutput || '').trim();
    if (ok && userId) {
      await PracticeProgress.findOneAndUpdate({ userId }, { $inc: { codingSolved: 1 } }, { upsert: true });
    }
    res.json({ correct: ok, expected: p.sampleOutput });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* -------------------------
   MOCK INTERVIEWS (AI generation + fallback)
   POST /api/practice/mock/generate { techstack, qty }
   ------------------------- */
router.post('/mock/generate', async (req, res) => {
  try {
    const { techstack = 'General', qty = 5 } = req.body;
    const count = Math.min(Math.max(parseInt(qty, 10) || 1, 1), 20);

    // build strict JSON-only prompt
    const prompt = `You are an expert technical interviewer. Produce EXACTLY a JSON array with ${count} objects.
Each object must have keys:
  "question" (string),
  "options" (array of 4 strings),
  "answer" (the correct option string).
The questions should be about "${techstack}".
Return ONLY valid JSON (no commentary, no markdown, no code fences).`;

    // 1) Try OpenAI (if key present)
    if (process.env.OPENAI_API_KEY) {
      try {
        const openAIRes = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are a JSON-only generator' }, { role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 1200
          },
          { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );
        const text = openAIRes.data.choices[0].message.content;
        const parsed = parseJsonBestEffort(text);
        if (Array.isArray(parsed) && parsed.length) {
          // Save to DB for caching
          const saveDocs = parsed.map(item => ({
            techstack, role: techstack, question: item.question, hint: item.hint || '', sampleAnswer: item.sampleAnswer || item.answer || '', generatedByAI: true
          }));
          try { await MockQuestion.insertMany(saveDocs); } catch (e) { /* ignore dup errors */ }
          return res.json({ source: 'ai', questions: parsed });
        }
      } catch (openErr) {
        console.warn('OpenAI failed:', openErr?.response?.data || openErr.message);
      }
    }

    // 2) Try HuggingFace inference (optional)
    if (process.env.HF_API_KEY) {
      try {
        const hfPayload = { inputs: prompt, options: { wait_for_model: true } };
        const hfRes = await axios.post(
          'https://api-inference.huggingface.co/models/google/flan-t5-large',
          hfPayload,
          { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` }, timeout: 45000 }
        );
        // extract text
        let txt = '';
        if (Array.isArray(hfRes.data) && hfRes.data[0].generated_text) txt = hfRes.data[0].generated_text;
        else if (hfRes.data.generated_text) txt = hfRes.data.generated_text;
        const parsed = parseJsonBestEffort(txt);
        if (Array.isArray(parsed) && parsed.length) return res.json({ source: 'hf', questions: parsed });
      } catch (hfErr) {
        console.warn('HF failed:', hfErr?.response?.data || hfErr.message);
      }
    }

    // 3) DB fallback: return existing mock questions for techstack
    const fallback = await MockQuestion.find({ techstack: new RegExp(techstack, 'i') }).limit(count);
    if (fallback && fallback.length) {
      const mapped = fallback.map(f => ({
        question: f.question,
        options: f.options || [], // if saved as MCQ
        answer: f.sampleAnswer || f.answer || ''
      }));
      return res.json({ source: 'db', questions: mapped });
    }

    // Final fallback: static samples
    const staticSamples = Array.from({ length: count }).map((_, i) => ({
      question: `Sample ${i + 1} question about ${techstack}`,
      options: ['A', 'B', 'C', 'D'],
      answer: 'A'
    }));
    return res.json({ source: 'static', questions: staticSamples });
  } catch (err) {
    console.error('Error generating mock questions', err?.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate questions', detail: err.message });
  }
});

/* -------------------------
   Mock feedback: POST /api/practice/mock/feedback
   body: { question, userAnswer, sampleAnswer }
   ------------------------- */
router.post('/mock/feedback', async (req, res) => {
  try {
    const { question, userAnswer = '', sampleAnswer = '' } = req.body;
    const prompt = `You are a helpful technical interviewer. Given:
Question: "${question}"
Sample good answer: "${sampleAnswer}"
Candidate answer: "${userAnswer}"
Return EXACTLY a JSON object: { "critique": ["...","..."], "suggestions": ["...","...","..."] } and nothing else.`;

    // Attempt OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const r = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'You are an expert interviewer.' }, { role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 500
        }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });

        const text = r.data.choices[0].message.content;
        const parsed = parseJsonBestEffort(text);
        if (parsed) return res.json({ source: 'ai', ...parsed });
      } catch (openErr) {
        console.warn('OpenAI feedback error:', openErr?.response?.data || openErr.message);
      }
    }

    // fallback simple critique
    const basic = {
      critique: ['Answer incomplete', 'Missing explanation of key concepts'],
      suggestions: ['Structure your answer: definition, example, tradeoffs', 'Give 1 small code/example', 'Practice concise summaries']
    };
    return res.json({ source: 'static', ...basic });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get feedback', detail: err.message });
  }
});

/* -------------------------
   PROGRESS
   GET /api/practice/progress/:userId
   ------------------------- */
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let pr = await PracticeProgress.findOne({ userId });
    if (!pr) pr = await PracticeProgress.create({ userId });
    res.json(pr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
