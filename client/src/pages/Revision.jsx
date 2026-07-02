import { useState, useEffect } from "react";
import axios from "axios";

function Revision() {

  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [revisions, setRevisions] = useState([]);

  const addRevision = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/revisions",
        {
          subject,
          topic
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTopic("");
      setSubject("");

      fetchRevisions();

    } catch (err) {
      console.log(err.response?.data);
    }

  };

  const fetchRevisions = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/revisions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRevisions(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    fetchRevisions();
  }, []);


  return (
    <div>

      <h2>Revision Tracker</h2>

      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={addRevision}>
        Add Revision
      </button>

      <hr />

      {revisions.map((rev) => (
        <div style={{ marginTop: "20px" }}>
 {revisions.map((rev) => (
  <div
    key={rev._id}
    style={{
      border: "1px solid #ccc",
      padding: "12px",
      marginBottom: "10px",
      borderRadius: "6px"
    }}
  >
    <h4>{rev.subject}</h4>

    <p>Topic: {rev.topic}</p>

    <p>
      Next Revision:{" "}
      {rev.nextRevision
        ? new Date(rev.nextRevision).toLocaleDateString()
        : "Not scheduled"}
    </p>

      <button
        onClick={async () => {
          const token = localStorage.getItem("token");

          await axios.put(
            `http://localhost:5000/api/revisions/revise/${rev._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          fetchRevisions();
        }}
      >
        Mark Revised
      </button>
    </div>
  ))}
</div>
      ))}

    </div>
  );

}

export default Revision;