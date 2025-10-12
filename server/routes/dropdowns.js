const express = require("express");
const router = express.Router();

const Course = require("../models/courseModel");
const Job = require("../models/Job");
const Tutorial = require("../models/Tutorial");
const Practice = require("../models/Practice");
const Exam = require("../models/Exam");

// Fetch all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({}, "_id title");
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({}, "_id title");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch all tutorials
router.get("/tutorials", async (req, res) => {
  try {
    const tutorials = await Tutorial.find({}, "_id title");
    res.json(tutorials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch all practice items
router.get("/practice", async (req, res) => {
  try {
    const practices = await Practice.find({}, "_id title");
    res.json(practices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch all exams
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find({}, "_id title");
    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
