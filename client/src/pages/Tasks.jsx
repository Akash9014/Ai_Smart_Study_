import { useState, useEffect } from "react";
import API from "../Services/api";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ---------------- FETCH TASKS ---------------- */

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- ADD / UPDATE TASK ---------------- */

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {

      if (editingTaskId) {

        await API.put(`/tasks/${editingTaskId}`, {
          title,
          description,
          priority,
          deadline
        });

        setEditingTaskId(null);

      } else {

        await API.post("/tasks", {
          title,
          description,
          priority,
          deadline
        });

      }

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- DELETE TASK ---------------- */

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- TOGGLE COMPLETE ---------------- */

  const handleComplete = async (task) => {
    try {

      await API.put(`/tasks/${task._id}`, {
        status: task.status === "completed" ? "pending" : "completed"
      });

      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- EDIT TASK ---------------- */

  const handleEdit = (task) => {

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);

    setDeadline(
      task.deadline ? task.deadline.split("T")[0] : ""
    );

    setEditingTaskId(task._id);
  };

  /* ---------------- FILTER + SEARCH ---------------- */

  const filteredTasks = tasks.filter((task) => {

    if (!task.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (filter === "pending") {
      return task.status === "pending";
    }

    if (filter === "completed") {
      return task.status === "completed";
    }

    return true;
  });

  /* ---------------- SORT ---------------- */

  let sortedTasks = [...filteredTasks];

  if (sortBy === "deadline") {

    sortedTasks.sort((a, b) => {

      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      return new Date(a.deadline) - new Date(b.deadline);

    });

  }

  if (sortBy === "status") {

    sortedTasks.sort(
      (a, b) => a.status.localeCompare(b.status)
    );

  }

  /* ---------------- STATS ---------------- */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (t) => t.status === "pending"
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.deadline &&
      new Date(task.deadline) < new Date() &&
      task.status !== "completed"
  ).length;

  return (

    <div style={{ padding: "20px" }}>

      <h2>Task Manager</h2>

      {/* SEARCH + SORT */}

      <div style={{ marginBottom: "15px" }}>

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginLeft: "10px", padding: "8px" }}
        >

          <option value="">Sort</option>
          <option value="deadline">Deadline</option>
          <option value="status">Status</option>

        </select>

      </div>

      {/* FILTER */}

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {/* STATS */}

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>Total: {totalTasks}</div>
        <div>Completed: {completedTasks}</div>
        <div>Pending: {pendingTasks}</div>
        <div style={{ color: "red" }}>Overdue: {overdueTasks}</div>
      </div>

      {/* ADD TASK FORM */}

      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginLeft: "10px" }}
        >

          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>

        </select>

        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>

      </form>

      {/* TASK LIST */}

      <ul style={{ listStyle: "none", padding: 0 }}>

        {sortedTasks.map((task) => (

          <li
            key={task._id}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #ccc",
              background:
                task.status === "completed"
                  ? "#d1fae5"
                  : task.deadline &&
                    new Date(task.deadline) < new Date() &&
                    task.status !== "completed"
                  ? "#fecaca"
                  : "#fff"
            }}
          >

            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <p>Priority: {task.priority}</p>

            <p>Status: {task.status}</p>

            <p>
              Deadline:{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString()
                : "No deadline"}
            </p>

            {task.deadline &&
              new Date(task.deadline) < new Date() &&
              task.status === "pending" && (
                <p style={{ color: "red" }}>⚠ Overdue</p>
              )}

            <button onClick={() => handleComplete(task)}>
              Toggle Complete
            </button>

            <button
              onClick={() => handleEdit(task)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(task._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>

          </li>

        ))}

      </ul>

    </div>

  );
}

export default Tasks;