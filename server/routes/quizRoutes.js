const express = require('express');
const fetch = require('node-fetch');
const Question = require('../models/Question');
const UserProgress = require('../models/userProgress');

const router = express.Router();

const getGeminiQuestions = async (topic, level, count) => {
  const prompt = `Generate ${count} multiple-choice questions for topic "${topic}" at ${level} difficulty. Format strictly as JSON:
[
  { "question": "text", "options": ["a","b","c","d"], "correctAnswer": "b" }
]`;

  const response = await fetch('https://api.gemini.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  return data.questions || [];
};

router.post('/generate', async (req, res) => {
  try {
    const { topic, level, count } = req.body;

    const aiCount = Math.ceil(count / 2);
    const dbCount = count - aiCount;

    const geminiQuestions = await getGeminiQuestions(topic, level, aiCount);
    const dbQuestions = await Question.aggregate([
      { $match: { topic, level } },
      { $sample: { size: dbCount } }
    ]);

    const finalQuestions = [...geminiQuestions, ...dbQuestions].sort(() => Math.random() - 0.5);
    res.json(finalQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { userId, answers } = req.body;

    let score = 0;
    answers.forEach(ans => {
      if (ans.selected === ans.correctAnswer) score++;
    });

    const pointsEarned = score * 10;

    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId, quizzes: [] });
    }

    userProgress.quizzes.push({
      topic: answers[0].topic,
      level: answers[0].level,
      score,
      pointsEarned
    });

    await userProgress.save();
    res.json({ score, pointsEarned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/progress/:userId', async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.params.userId });
    res.json(progress || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
