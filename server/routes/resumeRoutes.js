const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/tips', async (req, res) => {
  try {
    const { role, skills } = req.body;
    const prompt = `Provide resume improvement tips for a ${role} with skills: ${skills}. Return as a bullet list.`;

    const response = await fetch('https://api.gemini.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    res.json({ tips: data.result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
