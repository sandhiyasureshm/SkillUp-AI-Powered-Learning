import express from "express";
import axios from "axios";
const router = express.Router();

// ✅ Live Government Exam Fetch API (real-time)
router.get("/live", async (req, res) => {
  try {
    // Using a reliable news feed for exams
    const response = await axios.get(
      "https://newsdata.io/api/1/news?apikey=pub_50721b9d44b7c859efef96ee40f904a02f8d5&q=government%20exam%20notification&country=in&language=en"
    );

    // Simplify and send only exam-related titles
    const exams = response.data.results.map((item) => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      source: item.source_id,
    }));

    res.json(exams);
  } catch (err) {
    console.error("Error fetching live exam data:", err.message);
    res.status(500).json({ error: "Failed to fetch live government exams." });
  }
});

export default router;
