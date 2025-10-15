const express = require("express");
const axios = require("axios");
const router = express.Router();

// Central government exam RSS feeds
const feeds = {
  upsc: "https://www.upsc.gov.in/sites/default/files/rss.xml",
  ssc: "https://ssc.nic.in/rss-feed.xml",
  ibps: "https://www.ibps.in/rss-feed.xml"
};

// Route: GET /api/exams/live-exams
// This entire function MUST be wrapped in a single try/catch block 
// to ensure no internal error crashes the server and returns a 500.
router.get("/live-exams", async (req, res) => {
  let allArticles = [];

  for (const [name, rssUrl] of Object.entries(feeds)) {
    try {
      // It's essential that this external API call is wrapped in its own try/catch
      const response = await axios.get("https://api.rss2json.com/v1/api.json", {
        params: { rss_url: rssUrl },
        // Increased timeout from 10000ms to 20000ms for stability on slower connections
        timeout: 20000 
      });

      if (response.data.items) {
        const articles = response.data.items.slice(0, 5).map(item => ({
          source: name.toUpperCase(),
          title: item.title,
          link: item.link,
          pubDate: item.pubDate
        }));
        allArticles = allArticles.concat(articles);
      }
    } catch (err) {
      // Only log the error but allow the server to continue fetching other feeds
      console.warn(`Error fetching ${name} feed:`, err.message);
    }
  }

  // Final success or failure response should be outside the loop.
  if (allArticles.length === 0) {
    // If no data was fetched but the server didn't crash, return a helpful message.
    return res.status(200).json({
      status: "warning",
      message: "Successfully accessed server, but failed to fetch updates from external RSS feeds.",
      articles: []
    });
  }

  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.json({ status: "success", articles: allArticles });
});

module.exports = router;
