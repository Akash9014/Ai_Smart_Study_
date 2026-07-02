const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// ADD TASK
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;

    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      priority,
      deadline,
    });
console.log("REQ.USER:", req.user);
    const savedTask = await newTask.save();
    res.json(savedTask);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER TASKS
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ deadline: 1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE TASK
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);

    const updatedTask = await task.save();
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;