import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function Navbar({ setDarkMode }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h3>Smart Study Assistant</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        
        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "none",
            background: "#6366f1",
            color: "#fff"
          }}
        >
          🌙
        </button>

        {/* User Info */}
        {user && <span>Welcome {user.name}</span>}

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: "#ef4444",
            color: "#fff"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;