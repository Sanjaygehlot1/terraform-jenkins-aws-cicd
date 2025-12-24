import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface issuesInterface {
  id: string
  status: "CLOSED" | "IN_PROGRESS" | "OPEN"
  title: string
}

export default function App() {
  const [issues, setIssues] = useState<issuesInterface[] | []>([]);
  const [title, setTitle] = useState("");

  const loadIssues = async () => {
    const res = await fetch(`${API_URL}/issues`);
    const data = await res.json();
    setIssues(data);
  };

  const createIssue = async () => {
    if (!title) return;
    await fetch(`${API_URL}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    loadIssues();
  };

  const closeIssue = async (id: any) => {
    await fetch(`${API_URL}/issues/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CLOSED" }),
    });
    loadIssues();
  };

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Issue Tracker</h2>

      <input
        placeholder="New issue"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createIssue}>Add</button>

      <ul>
        {issues.map((i) => (
          <li key={i.id}>
            {i.title} — {i.status}
            {i.status !== "CLOSED" && (
              <button onClick={() => closeIssue(i.id)}>Close</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
