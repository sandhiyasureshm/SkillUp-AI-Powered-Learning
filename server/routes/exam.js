const express = require("express");
const axios = require("axios");
const router = express.Router();

// Central government exam RSS feeds
const feeds = {
  // NOTE: You must verify these URLs. The temporary BBC feed proved the code works, 
  // but the current URLs below are likely failing to return content.
  upsc: "https://www.upsc.gov.in/sites/default/files/rss.xml",
  ssc: "https://ssc.nic.in/rss-feed.xml",
  // Restored original IBPS URL. If it fails, find a new one!
  ibps: "https://www.ibps.in/rss-feed.xml" 
};

// Route: GET /api/exams/live-exams
router.get("/live-exams", async (req, res) => {
  // CRITICAL IMPROVEMENT: Wrap the whole function in try/catch for 500 error handling
  try {
    let allArticles = [];

    for (const [name, rssUrl] of Object.entries(feeds)) {
      try {
        // It's essential that this external API call is wrapped in its own try/catch
        const response = await axios.get("https://api.rss2json.com/v1/api.json", {
          params: { rss_url: rssUrl },
          // Increased timeout from 10000ms to 20000ms for stability on slower connections
          timeout: 20000 
        });

        if (response.data.items && response.data.items.length > 0) {
          const articles = response.data.items.slice(0, 5).map(item => ({
            source: name.toUpperCase(),
            title: item.title,
            link: item.link,
            pubDate: item.pubDate
          }));
          allArticles = allArticles.concat(articles);
        } else {
          // Log if the proxy returned an empty item list for a specific feed
          console.warn(`Feed proxy returned no items for ${name}. Check feed validity.`);
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
        message: "Server accessed successfully, but no live updates could be fetched from external RSS feeds. Updates may be temporarily unavailable or URLs require verification.",
        articles: []
      });
    }

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // We've successfully fetched data!
    res.json({ status: "success", articles: allArticles });
  } catch (error) {
    // If ANY unhandled error occurred (network issue, unexpected JSON parse),
    // return a clean 500 response and log the error.
    console.error("Critical error in /live-exams route:", error);
    res.status(500).json({ status: "error", message: "An internal server error occurred while processing the request." });
  }
});

module.exports = router;
