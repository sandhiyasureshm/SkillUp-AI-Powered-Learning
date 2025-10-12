const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const categoryMap = {
  fresher: "fresher entry level",
  experienced: "experienced software",
  "it-software": "IT software",
  marketing: "marketing",
  internships: "internship",
  govt: "government"
};

router.get("/:category", async (req, res) => {
  const { category } = req.params;
  const { query = "", location = "", jobType = "" } = req.query;

  const whatAnd = query || categoryMap[category];
  if (!whatAnd) return res.status(400).json({ message: "Invalid category or query" });

  try {
    // Construct the Adzuna API URL
    let url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=20`;

    if (whatAnd) url += `&what_and=${encodeURIComponent(whatAnd)}`;
    if (location) url += `&where=${encodeURIComponent(location)}`;
    if (jobType) url += `&contract_type=${encodeURIComponent(jobType)}`;

    console.log("🔗 Fetching from Adzuna API:", url);

    const response = await axios.get(url);

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      url: job.redirect_url,
      salary: job.salary_min ? `₹${job.salary_min} - ₹${job.salary_max}` : "Not disclosed",
    }));

    res.json(jobs);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
});

module.exports = router;
