console.log("TrackMyDSA loaded successfully");

// helper: base url of backend
const API_BASE = "http://localhost:3000/api/problems";

// get elements
const problemsContainer = document.getElementById("problems-container");
const form = document.getElementById("problem-form");
const inputTitle = document.getElementById("p-title");
const inputPlatform = document.getElementById("p-platform");
const inputTopic = document.getElementById("p-topic");
const inputDifficulty = document.getElementById("p-difficulty");

// 1) Fetch & render problems
async function loadProblems() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    renderProblems(data);
  } catch (err) {
    console.error("Failed to load problems:", err);
    problemsContainer.innerHTML = "<p>Could not load problems. Check backend.</p>";
  }
}

function renderProblems(list) {
  if (!Array.isArray(list) || list.length === 0) {
    problemsContainer.innerHTML = "<p>No problems yet. Add some!</p>";
    return;
  }

  // create cards
  problemsContainer.innerHTML = list
    .map((p) => {
      return `
      <div class="feature-card" data-id="${p.id}">
        <h3>${escapeHtml(p.title)}</h3>
        <p><strong>Platform:</strong> ${escapeHtml(p.platform || "")}</p>
        <p><strong>Topic:</strong> ${escapeHtml(p.topic || "")}</p>
        <p><strong>Difficulty:</strong> ${escapeHtml(p.difficulty || "")}</p>
        <p><strong>Status:</strong> <span class="status">${escapeHtml(p.status || "todo")}</span></p>
        <div style="margin-top:8px;">
          <button class="btn-done">Mark done</button>
          <button class="btn-delete" style="margin-left:8px;">Delete</button>
        </div>
      </div>
      `;
    })
    .join("");
}

// small XSS-avoid helper
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (s) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[s]));
}

// 2) Form submit -> POST
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    title: inputTitle.value.trim(),
    platform: inputPlatform.value.trim(),
    topic: inputTopic.value.trim(),
    difficulty: inputDifficulty.value,
    status: "todo",
  };
  if (!payload.title) return alert("Title required");

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Created:", data);
    // clear form
    inputTitle.value = "";
    inputPlatform.value = "";
    inputTopic.value = "";
    inputDifficulty.value = "Medium";
    // reload list
    loadProblems();
  } catch (err) {
    console.error("Create failed:", err);
    alert("Could not add problem. See console.");
  }
});

// 3) Delegated event handling for done/delete buttons
problemsContainer.addEventListener("click", async (e) => {
  const card = e.target.closest(".feature-card");
  if (!card) return;
  const id = card.getAttribute("data-id");

  // Delete
  if (e.target.classList.contains("btn-delete")) {
    if (!confirm("Delete this problem?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      loadProblems();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
    return;
  }

  // Mark done (PUT)
  if (e.target.classList.contains("btn-done")) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      const updated = await res.json();
      console.log("Updated:", updated);
      loadProblems();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
    return;
  }
});

// initial load
loadProblems();
