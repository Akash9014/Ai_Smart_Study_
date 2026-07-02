import { useState } from "react";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("");
  const [plan, setPlan] = useState([]);

  const generatePlan = () => {
    if (!subjects || !hours) return;

    const list = subjects.split(",");

    // Parse subjects with difficulty
    const parsed = list
      .map((item) => {
        const [name, level] = item.split(":");

        return {
          name: name?.trim(),
          level: level?.trim().toLowerCase() || "medium",
        };
      })
      .filter((item) => item.name);

    const totalHours = parseInt(hours);

    if (parsed.length === 0 || isNaN(totalHours)) return;

    // Weight system
    const weightMap = {
      hard: 3,
      medium: 2,
      easy: 1,
    };

    // Total weight
    const totalWeight = parsed.reduce(
      (sum, sub) => sum + (weightMap[sub.level] || 2),
      0
    );

    // Generate plan
    const newPlan = parsed.map((sub) => {
      const weight = weightMap[sub.level] || 2;

      const time = (weight / totalWeight) * totalHours;

      return {
        subject: sub.name,
        time: time.toFixed(1),
        level: sub.level,
      };
    });

    setPlan(newPlan);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Study Plan Generator</h2>

      {/* Inputs */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="DSA:hard, DBMS:medium, Java:easy"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            
          }}
        />
        <br />

        <input
          type="number"
          placeholder="Available hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Button */}
      <button
        onClick={generatePlan}
        style={{
          padding: "10px 18px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Generate Smart Plan
      </button>

      {/* Output */}
      {plan.length > 0 && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            backgroundColor: "#1e293b",
            color: "white",
            borderRadius: "8px",
            width: "320px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Smart Study Plan</h3>

          {plan.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: "white",
                color: "black",
                borderRadius: "6px",
              }}
            >
              <strong>{item.subject}</strong> ({item.level}) →{" "}
              {item.time} hrs
            </div>
          ))}

          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            💡 Take a 5 min break after every 25 min session
          </p>
        </div>
      )}
    </div>
  );
}