import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

function Analytics() {

  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todayRevisions, setTodayRevisions] = useState([]); // NEW
  const [score, setScore] = useState(0); // NEW

  // =========================
  // 📥 Fetch sessions
  // =========================
  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/sessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 📥 Fetch tasks
  // =========================
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 📥 Fetch today's revisions (IMPORTANT)
  // =========================
  const fetchRevisions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/revisions/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodayRevisions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 🧠 Productivity Score Logic
  // =========================
  const calculateScore = (sessions, tasks, revisions) => {

    const studyMinutes = sessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    const completedTasks = tasks.filter(
      t => t.status === "completed"
    ).length;

    const revisionCount = revisions.length;

    const score =
      (studyMinutes / 10) +
      (completedTasks * 5) +
      (revisionCount * 3);

    setScore(Math.floor(score));
  };

  // =========================
  // 🚀 Load Data
  // =========================
  useEffect(() => {
    fetchSessions();
    fetchTasks();
    fetchRevisions(); // NEW
  }, []);

  // =========================
  // 🧠 Trigger Score Calculation
  // =========================
  useEffect(() => {
    if (sessions.length && tasks.length) {
      calculateScore(sessions, tasks, todayRevisions);
    }
  }, [sessions, tasks, todayRevisions]);

  // =========================
  // 📊 Weekly Study Chart
  // =========================
  const studyPerDay = {};

  sessions.forEach((session) => {
    const date = new Date(session.date).toLocaleDateString();

    if (!studyPerDay[date]) {
      studyPerDay[date] = 0;
    }

    studyPerDay[date] += session.duration;
  });

  const studyChartData = {
    labels: Object.keys(studyPerDay),
    datasets: [
      {
        label: "Study Minutes",
        data: Object.values(studyPerDay),
      },
    ],
  };

  // =========================
  // 📊 Task Chart
  // =========================
  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const taskChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
      },
    ],
  };

  // =========================
  // ⏱ Total Study Time
  // =========================
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  const totalHours = (totalMinutes / 60).toFixed(2);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analytics Dashboard</h2>

      {/* =========================
          🔥 Productivity Score UI
      ========================= */}
      <div style={{
        background: "#eef2ff",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3>Productivity Score</h3>
        <h1>{score}</h1>

        <p>
          {score > 80 && "🔥 Excellent Productivity"}
          {score > 50 && score <= 80 && "👍 Good Progress"}
          {score <= 50 && "⚡ Needs Improvement"}
        </p>

        {/* Progress Bar */}
        <div style={{
          height: "10px",
          background: "#ddd",
          borderRadius: "5px"
        }}>
          <div style={{
            width: `${Math.min(score, 100)}%`,
            background: "#6366f1",
            height: "100%",
            borderRadius: "5px"
          }} />
        </div>
      </div>

      <h3>Total Study Time: {totalMinutes} minutes ({totalHours} hrs)</h3>

      <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>

        {/* Study Chart */}
        <div style={{ width: "50%" }}>
          <h4>Study Activity</h4>
          <Bar data={studyChartData} />
        </div>

        {/* Task Chart */}
        <div style={{ width: "40%" }}>
          <h4>Task Status</h4>
          <Doughnut data={taskChartData} />
        </div>

      </div>
    </div>
  );
}

export default Analytics;