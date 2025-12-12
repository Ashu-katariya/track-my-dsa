const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());


const PORT = 3000;

// Temporary in-memory "database"
let nextId = 3;

let problems = [
  {
    id: 1,
    title: "Two Sum",
    platform: "LeetCode",
    topic: "Array",
    difficulty: "Easy",
    status: "todo",
  },
  {
    id: 2,
    title: "Reverse Linked List",
    platform: "LeetCode",
    topic: "Linked List",
    difficulty: "Medium",
    status: "in-progress",
  },
];

// Get all problems
app.get("/api/problems", (req, res) => {
  res.json(problems);
});



// Simple route to test server
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TrackMyDSA backend is running",
    time: new Date().toISOString(),
  });
});

// Add a new problem
app.post("/api/problems", (req, res) => {
  const { title, platform, topic, difficulty, status } = req.body;

  // Simple validation
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newProblem = {
    id: nextId++,
    title,
    platform: platform || "Unknown",
    topic: topic || "Misc",
    difficulty: difficulty || "Medium",
    status: status || "todo",
  };

  problems.push(newProblem);

  return res.status(201).json(newProblem);
});

app.put("/api/problems/:id", (req, res) => {
  const id = Number(req.params.id);  // URL wale id ko number me badlo
  const idx = problems.findIndex(p => p.id === id); // is id ka object kaha h array me

  if (idx === -1) {
    return res.status(404).json({ error: "Problem nahi mili" });
  }

  // Purane data + naye data ko merge kar do
  problems[idx] = { ...problems[idx], ...req.body, id };

  res.json(problems[idx]); // updated problem bhej do
});

app.delete("/api/problems/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = problems.some(p => p.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Problem nahi mili" });
  }

  problems = problems.filter(p => p.id !== id); // is id wali problem ko hata do

  res.json({ success: true });
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
