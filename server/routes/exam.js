

import express from "express";
import axios from "axios";

const router = express.Router(); // ✅ Use router, not app

// Central government exam RSS feeds
const feeds = {
  upsc: "https://www.upsc.gov.in/sites/default/files/rss.xml",
  ssc: "https://ssc.nic.in/rss-feed.xml",
  ibps: "https://www.ibps.in/rss-feed.xml"
};

router.get("/live-exams", async (req, res) => {
  try {
    let allArticles = [];

    for (const [name, rssUrl] of Object.entries(feeds)) {
      try {
        const response = await axios.get("https://api.rss2json.com/v1/api.json", {
          params: { rss_url: rssUrl },
          timeout: 10000
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
        console.warn(`Error fetching ${name} feed:`, err.message);
      }
    }

    if (allArticles.length === 0) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch any exam updates."
      });
    }

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.json({ status: "success", articles: allArticles });
  } catch (err) {
    console.error("Error fetching live exams:", err.message);
    res.status(500).json({ status: "error", message: "Failed to fetch live updates." });
  }
});

export default router;


