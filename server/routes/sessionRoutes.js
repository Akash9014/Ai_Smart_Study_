const express = require("express");
const StudySession = require("../models/StudySession");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Create session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const session = await StudySession.create({
      user: req.user.id,
      duration: req.body.duration,
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sessions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
