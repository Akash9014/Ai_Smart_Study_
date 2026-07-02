const express = require("express");
const router = express.Router();
const Revision = require("../models/Revision");
const auth = require("../middleware/auth");


// CREATE REVISION
router.post("/", auth, async (req, res) => {
  try {
    const { subject, topic } = req.body;

    const nextRevision = new Date();
    nextRevision.setDate(nextRevision.getDate() + 1);

    const revision = new Revision({
      userId: req.user.id,
      subject,
      topic,
      nextRevision
    });

    await revision.save();

    res.json(revision);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// GET ALL REVISIONS
router.get("/", auth, async (req, res) => {
  try {

    const revisions = await Revision.find({
      userId: req.user.id
    }).sort({ nextRevision: 1 });

    res.json(revisions);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET TODAY REVISIONS
router.get("/today", auth, async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const revisions = await Revision.find({
      userId: req.user.id,
      nextRevision: { $gte: today, $lt: tomorrow }
    });

    res.json(revisions);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// MARK REVISION AS COMPLETED
router.put("/revise/:id", auth, async (req, res) => {
  try {

    const revision = await Revision.findById(req.params.id);

    if (!revision) {
      return res.status(404).json({ message: "Not found" });
    }

    const next = new Date();
    next.setDate(next.getDate() + 3); // next revision in 3 days

    revision.nextRevision = next;

    await revision.save();

    res.json(revision);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;