require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const revisionRoutes = require("./routes/revisionRoutes");

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/revisions", revisionRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
