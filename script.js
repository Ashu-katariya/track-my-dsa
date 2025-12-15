const API_URL = "https://trackmydsa-backend.onrender.com/api/problems";
console.log("🔥 NEW FRONTEND LOADED");



// DOM elements
const container = document.getElementById("problems-container");
const filterSelect = document.getElementById("filterStatus");

const countTotal = document.getElementById("count-total");
const countTodo = document.getElementById("count-todo");
const countProgress = document.getElementById("count-progress");
const countDone = document.getElementById("count-done");

// form inputs
const form = document.getElementById("problem-form");
const titleInput = document.getElementById("p-title");
const platformInput = document.getElementById("p-platform");
const topicInput = document.getElementById("p-topic");
const difficultyInput = document.getElementById("p-difficulty");

let allProblems = [];

// Load problems
async function loadProblems() {
  const res = await fetch(API_URL);
  const data = await res.json();

  allProblems = data;
  updateCounts(data);
  applyFilterAndRender();
}

// Update counters
function updateCounts(problems) {
  countTotal.innerText = problems.length;
  countTodo.innerText = problems.filter(p => p.status === "todo").length;
  countProgress.innerText = problems.filter(p => p.status === "in-progress").length;
  countDone.innerText = problems.filter(p => p.status === "done").length;
}

// Filter + render
function applyFilterAndRender() {
  const filter = filterSelect.value;
  let filtered = allProblems;

  if (filter !== "all") {
    filtered = allProblems.filter(p => p.status === filter);
  }

  renderProblems(filtered);
}

filterSelect.addEventListener("change", applyFilterAndRender);

// Render cards
function renderProblems(problems) {
  container.innerHTML = "";

  if (problems.length === 0) {
    container.innerHTML = "<p>No problems yet.</p>";
    return;
  }

  problems.forEach(p => {
    const card = document.createElement("div");
    card.className = "feature-card";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>Platform: ${p.platform || ""}</p>
      <p>Topic: ${p.topic || ""}</p>
      <span class="badge difficulty ${p.difficulty.toLowerCase()}">
  ${p.difficulty}
</span>


      <label>Status:</label>
      <select class="statusSelect" data-id="${p._id}">
        <option value="todo" ${p.status === "todo" ? "selected" : ""}>Todo</option>
        <option value="in-progress" ${p.status === "in-progress" ? "selected" : ""}>In Progress</option>
        <option value="done" ${p.status === "done" ? "selected" : ""}>Done</option>
      </select>

      <button class="deleteBtn" data-id="${p._id}">Delete</button>

      <div class="notes-section">
  <label>Notes:</label>
  <textarea 
    class="notesInput" 
    data-id="${p._id}" 
    placeholder="Approach, edge cases, mistakes..."
  >${p.notes || ""}</textarea>

  <button class="saveNotesBtn" data-id="${p._id}">
    Save Notes
  </button>
</div>

    `;

    container.appendChild(card);
  });
}

// Add problem
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) return alert("Title required");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      platform: platformInput.value,
      topic: topicInput.value,
      difficulty: difficultyInput.value,
      status: "todo",
    }),
  });

  form.reset();
  difficultyInput.value = "Medium";
  loadProblems();
});

// Status update
document.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("statusSelect")) return;

  await fetch(`${API_URL}/${e.target.dataset.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: e.target.value }),
  });

  loadProblems();
});

// Delete
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("deleteBtn")) return;
  if (!confirm("Delete this problem?")) return;

  await fetch(`${API_URL}/${e.target.dataset.id}`, {
    method: "DELETE",
  });

  loadProblems();
});

// Notes save
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("saveNotesBtn")) return;

  const id = e.target.dataset.id;

  const textarea = document.querySelector(
    `.notesInput[data-id="${id}"]`
  );

  const notes = textarea.value;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    console.log("Notes saved");
  } catch (err) {
    console.error("Failed to save notes", err);
  }
});


// Init
loadProblems();
