// ===============================
// TrackMyDSA – Auth Logic
// Login + Signup (Single Page)
// ===============================

const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const switchBtn = document.getElementById("switchBtn");
const switchText = document.getElementById("switchText");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let isLoginMode = true;

// -------------------------------
// API BASE (backend)
// -------------------------------
const API_BASE = "http://localhost:3000/api/auth";

// -------------------------------
// MODE SWITCH (Login <-> Signup)
// -------------------------------
switchBtn.addEventListener("click", () => {
  isLoginMode = !isLoginMode;

  // smooth text + field switch
  authTitle.style.opacity = 0;
  authForm.style.opacity = 0;

  setTimeout(() => {
    if (isLoginMode) {
      authTitle.innerText = "Welcome back";
      authBtn.innerText = "Login";
      switchText.innerText = "New here?";
      switchBtn.innerText = "Create an account";
      nameInput.classList.add("hidden");
    } else {
      authTitle.innerText = "Create your account";
      authBtn.innerText = "Sign up";
      switchText.innerText = "Already have an account?";
      switchBtn.innerText = "Login";
      nameInput.classList.remove("hidden");
    }

    authTitle.style.opacity = 1;
    authForm.style.opacity = 1;
  }, 200);
});

// -------------------------------
// FORM SUBMIT
// -------------------------------
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password || (!isLoginMode && !name)) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const endpoint = isLoginMode ? "/login" : "/register";

    const payload = isLoginMode
      ? { email, password }
      : { name, email, password };

    const res = await fetch(API_BASE + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    // ---------------------------
    // SUCCESS
    // ---------------------------
    if (isLoginMode) {
      // LOGIN → token save
      localStorage.setItem("token", data.token);

      // redirect to dashboard
      window.location.href = "/dashboard/layout.html";
    } else {
      // SIGNUP → stay on auth page (as discussed)
      alert("Account created successfully. Please login.");

      // switch back to login
      isLoginMode = true;
      nameInput.classList.add("hidden");
      authTitle.innerText = "Welcome back";
      authBtn.innerText = "Login";
      switchText.innerText = "New here?";
      switchBtn.innerText = "Create an account";
    }

  } catch (err) {
    console.error("Auth error:", err);
    alert("Server error. Try again.");
  }
});
