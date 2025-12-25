import { useEffect, useState } from "react";
import './index.css'

const API_URL = import.meta.env.VITE_API_URL;

interface issuesInterface {
  id: string;
  status: "CLOSED" | "IN_PROGRESS" | "OPEN";
  title: string;
}

export default function App() {
  const [issues, setIssues] = useState<issuesInterface[]>([]);
  const [title, setTitle] = useState("");

  const loadIssues = async () => {
    console.log(API_URL);
    console.log(import.meta.env.VITE_API_URL);
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

  const closeIssue = async (id: string) => {
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-white text-black border border-black";
      case "IN_PROGRESS":
        return "bg-gray-200 text-black border border-gray-400";
      case "CLOSED":
        return "bg-black text-white border border-black";
      default:
        return "bg-white text-black border border-black";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">Issue Tracker</h1>
          <div className="h-px bg-black"></div>
        </div>

        <div className="mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createIssue()}
              placeholder="Enter issue title..."
              className="flex-1 px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
            />
            <button
              onClick={createIssue}
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-light">
              No issues yet. Create one to get started.
            </div>
          ) : (
            issues.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-5 border border-gray-200 hover:border-black transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-base">{i.title}</span>
                  <span
                    className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${getStatusStyles(
                      i.status
                    )}`}
                  >
                    {i.status.replace("_", " ")}
                  </span>
                </div>
                {i.status !== "CLOSED" && (
                  <button
                    onClick={() => closeIssue(i.id)}
                    className="px-5 py-2 border border-black text-black hover:bg-black hover:text-white transition-all text-sm font-medium opacity-0 group-hover:opacity-100"
                  >
                    Close
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}