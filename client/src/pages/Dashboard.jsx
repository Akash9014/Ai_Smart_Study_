import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Tasks from "./Tasks";
import Timer from "./Timer";
import Revision from "./Revision";
import Analytics from "./Analytics";
import { Routes, Route } from "react-router-dom";
import Chart from "chart.js/auto";
import API from "../Services/api";
import axios from "axios";
import StudyPlanner from "./StudyPlanner";

// ---------------- CARD ----------------
const Card = ({ children }) => (
  <div
    style={{
      background: "var(--card)",
      color: "var(--text)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "20px",
      transition: "0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    {children}
  </div>
);

// ---------------- CHART ----------------
function StudyChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Study Minutes",
            data: data,
            backgroundColor: "#6366f1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [data]);

  return (
    <div style={{ height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

// ---------------- HOME ----------------
function HomeContent({ user, tasks }) {
  const [todayRevisions, setTodayRevisions] = useState([]);

  const fetchTodayRevisions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/revisions/today",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodayRevisions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markRevised = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/revisions/revise/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTodayRevisions();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodayRevisions();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const overdueTasks = tasks.filter(
    t =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.status !== "completed"
  ).length;

  const previewTasks = tasks.slice(0, 3);

  return (
    <>
      {/* Welcome */}
      {user && (
        <Card>
          <h2>Welcome, {user.name} 👋</h2>
          <p style={{ color: "var(--text)", opacity: 0.7 }}>
            Track your productivity and stay consistent
          </p>
        </Card>
      )}

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Card>Total Tasks: {totalTasks}</Card>
        <Card>Completed: {completedTasks}</Card>
        <Card>Pending: {pendingTasks}</Card>
      </div>

      {/* Revision */}
      <Card>
        <h3>Revision Reminder</h3>

        {todayRevisions.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No revisions today 🎉</p>
        ) : (
          todayRevisions.map((rev) => (
            <div
              key={rev._id}
              style={{
                padding: "10px",
                marginTop: "10px",
                borderRadius: "6px",
                background: "var(--bg)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{rev.topic}</strong> ({rev.subject})
              </div>

              <button
                onClick={() => markRevised(rev._id)}
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          ))
        )}
      </Card>

      {/* Tasks */}
      <Card>
        <h3>Upcoming Tasks</h3>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {previewTasks.map((task) => (
            <div
              key={task._id}
              style={{
                padding: "12px",
                borderRadius: "6px",
                background: "var(--bg)",
                minWidth: "180px",
              }}
            >
              <strong>{task.title}</strong>
              <div>Status: {task.status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Overdue */}
      {overdueTasks > 0 && (
        <Card>
          <div style={{ color: "#ef4444", fontWeight: "bold" }}>
            ⚠ You have {overdueTasks} overdue task(s)
          </div>
        </Card>
      )}

      {/* Bottom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        <Card>
          <Timer />
        </Card>

        <Card>
          <StudyChart data={[10, 20, 15, 30, 25, 0, 40]} />
        </Card>
      </div>
    </>
  );
}

// ---------------- DASHBOARD ----------------
function Dashboard({ setDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Navbar setDarkMode={setDarkMode} />

        <Routes>
          <Route index element={<HomeContent user={user} tasks={tasks} />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="timer" element={<Timer />} />
          <Route path="revision" element={<Revision />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="study-planner" element={<StudyPlanner />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;