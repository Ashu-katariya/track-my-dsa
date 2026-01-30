// ================= AUTH =================
const token = localStorage.getItem("token");
if (!token) window.location.href = "/auth.html";

const API_URL = "http://localhost:3000/api/problems";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ================= DOM =================
const todoList = document.getElementById("todo-list");
const progressList = document.getElementById("progress-list");
const doneList = document.getElementById("done-list");

const form = document.getElementById("problem-form");
const titleInput = document.getElementById("p-title");
const platformInput = document.getElementById("p-platform");
const topicInput = document.getElementById("p-topic");
const difficultyInput = document.getElementById("p-difficulty");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterStatus");

const countTotal = document.getElementById("count-total");
const countTodo = document.getElementById("count-todo");
const countProgress = document.getElementById("count-progress");
const countDone = document.getElementById("count-done");

let allProblems = [];

// ================= LOAD =================
async function loadProblems() {
  const res = await fetch(API_URL, { headers: authHeaders() });
  allProblems = await res.json();
  render();
  updateDashboardStats(); // 👈 VERY IMPORTANT
}


// ================= RENDER =================
function render() {
  todoList.innerHTML = "";
  progressList.innerHTML = "";
  doneList.innerHTML = "";

  let list = [...allProblems];

  const q = searchInput.value.toLowerCase();
  if (q) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q)
    );
  }

  if (filterSelect.value !== "all") {
    list = list.filter(p => p.status === filterSelect.value);
  }

  // COUNTS
  countTotal.textContent = allProblems.length;
  countTodo.textContent = allProblems.filter(p => p.status === "todo").length;
  countProgress.textContent = allProblems.filter(p => p.status === "in-progress").length;
  countDone.textContent = allProblems.filter(p => p.status === "done").length;

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "problem-card";

    card.innerHTML = `
      <h4>${p.title}</h4>
      <p>${p.platform} • ${p.topic}</p>

      <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>

      <select class="statusSelect" data-id="${p._id}">
        <option value="todo" ${p.status==="todo"?"selected":""}>Todo</option>
        <option value="in-progress" ${p.status==="in-progress"?"selected":""}>In Progress</option>
        <option value="done" ${p.status==="done"?"selected":""}>Done</option>
      </select>

      <button class="notesToggle" data-id="${p._id}">▶ Notes</button>

      <div class="notesBox" data-id="${p._id}">
        <textarea
          class="notesInput"
          data-id="${p._id}"
          placeholder="Write notes..."
        >${p.notes || ""}</textarea>
        <div class="notesStatus">Saved</div>
      </div>

      <button class="deleteBtn" data-id="${p._id}">Delete</button>
    `;

    if (p.status === "todo") todoList.appendChild(card);
    if (p.status === "in-progress") progressList.appendChild(card);
    if (p.status === "done") doneList.appendChild(card);
  });
}

// ================= ADD =================
form.addEventListener("submit", async e => {
  e.preventDefault();

  await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title: titleInput.value,
      platform: platformInput.value,
      topic: topicInput.value,
      difficulty: difficultyInput.value,
      status: "todo",
    }),
  });

  form.reset();
  loadProblems();
});

// ================= STATUS CHANGE =================
document.addEventListener("change", async e => {
  if (!e.target.classList.contains("statusSelect")) return;

  await fetch(`${API_URL}/${e.target.dataset.id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status: e.target.value }),
  });

  loadProblems();
});

// ================= DELETE =================
document.addEventListener("click", async e => {
  if (!e.target.classList.contains("deleteBtn")) return;

  await fetch(`${API_URL}/${e.target.dataset.id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  loadProblems();
});

// ================= SEARCH / FILTER =================
searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

// ================= NOTES TOGGLE =================
document.addEventListener("click", e => {
  if (!e.target.classList.contains("notesToggle")) return;

  const id = e.target.dataset.id;
  const box = document.querySelector(`.notesBox[data-id="${id}"]`);
  if (!box) return;

  box.classList.toggle("open");
  e.target.textContent = box.classList.contains("open")
    ? "▼ Notes"
    : "▶ Notes";
});

// ================= NOTES AUTO SAVE =================
let saveTimer = null;

document.addEventListener("input", e => {
  if (!e.target.classList.contains("notesInput")) return;

  const id = e.target.dataset.id;
  const status = e.target
    .closest(".notesBox")
    .querySelector(".notesStatus");

  status.textContent = "Saving...";

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ notes: e.target.value }),
    });

    status.textContent = "Saved ✓";
  }, 700);
});

function updateDashboardStats() {
  // allProblems tumhari existing array hai
  if (!Array.isArray(allProblems)) return;

  const total = allProblems.length;
  const done = allProblems.filter(p => p.status === "done").length;

  const totalEl = document.getElementById("dash-total");
  const doneEl = document.getElementById("dash-done");
  const streakEl = document.getElementById("dash-streak");

  if (totalEl) totalEl.innerText = total;
  if (doneEl) doneEl.innerText = done;

  if (streakEl) {
    streakEl.innerText = done > 0 ? "🔥 Active" : "❄️ Start Today";
  }
}

// ================= INIT =================
loadProblems();
