import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [pendingCount, setPendingCount] = useState(0);
  const [revisionCount, setRevisionCount] = useState(0);
  const location = useLocation();

  const fetchPendingTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pending = res.data.filter(
        (task) => task.status === "pending"
      );

      setPendingCount(pending.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRevisionCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/revisions/today",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRevisionCount(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPendingTasks();
    fetchRevisionCount();

    const interval = setInterval(() => {
      fetchPendingTasks();
      fetchRevisionCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 Menu Item
  const MenuItem = ({ to, label, count, color }) => {
    const isActive = location.pathname === to;

    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <div
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: isActive ? "#6366f1" : "transparent",
            color: isActive ? "#fff" : "var(--text)",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.background = "rgba(99,102,241,0.2)";
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.background = "transparent";
          }}
        >
          <span>{label}</span>

          {count > 0 && (
            <span
              style={{
                background: color,
                color: "#ffffff",
                borderRadius: "50%",
                padding: "4px 8px",
                fontSize: "12px",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {count}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div
      style={{
        width: "220px",
       background: "var(--sidebar)",
        color: "var(--text)",
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        borderRight: "1px solid rgba(0,0,0,0.1)",
        flexDirection: "column",
        borderRight: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <h2 style={{ marginBottom: "30px" }}>StudyAI</h2>

      {/* Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <MenuItem to="/dashboard" label="Home" />

        <MenuItem
          to="/dashboard/tasks"
          label="Tasks"
          count={pendingCount}
          color="#ef4444"
        />

        <MenuItem
          to="/dashboard/revision"
          label="Revision"
          count={revisionCount}
          color="#f59e0b"
        />

        <MenuItem to="/dashboard/timer" label="Focus Timer" />
        <MenuItem to="/dashboard/analytics" label="Analytics" />
        <MenuItem to="/dashboard/study-planner" label="Study Planner" />
      </div>
    </div>
  );
}

export default Sidebar;