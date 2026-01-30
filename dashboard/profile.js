// FRONTEND profile.js (browser)

const API = "http://localhost:3000/api/profile";

const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const bioEl = document.getElementById("profile-bio");
const goalEl = document.getElementById("profile-goal");
const levelEl = document.getElementById("profile-level");
const targetEl = document.getElementById("profile-target");
const saveBtn = document.getElementById("saveProfileBtn");

// LOAD PROFILE
async function loadProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("❌ No token found");

    const res = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) throw new Error("Profile fetch failed");

    const data = await res.json();
    console.log("✅ PROFILE:", data);

    nameEl.textContent = data.name;
    emailEl.textContent = data.email;

    bioEl.value = data.bio || "";
    goalEl.value = data.goal || "Crack Interviews";
    levelEl.value = data.level || "Beginner";
    targetEl.value = data.dailyTarget || 2;

    // sync topbar name
    const topName = document.querySelector(".user-name");
    if (topName) topName.textContent = data.name;

  } catch (err) {
    console.error("❌ Profile load error:", err.message);
  }
}

// SAVE PROFILE
saveBtn.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    const body = {
      bio: bioEl.value,
      goal: goalEl.value,
      level: levelEl.value,
      dailyTarget: targetEl.value
    };

    const res = await fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Profile update failed");

    const data = await res.json();
    console.log("✅ PROFILE UPDATED:", data);
    alert("Profile saved");

  } catch (err) {
    console.error("❌ Save error:", err.message);
    alert("Error saving profile");
  }
});

document.addEventListener("DOMContentLoaded", loadProfile);
