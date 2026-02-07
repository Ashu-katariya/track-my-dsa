// sidebar navigation logic

const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    // remove active from all
    navLinks.forEach(l => l.classList.remove("active"));

    // add active to clicked
    link.classList.add("active");

    const viewName = link.dataset.view;

    // hide all views
    views.forEach(v => v.classList.add("hidden"));

    // show selected view
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.remove("hidden");
    }
  });
});

// logout
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./auth.html";
});

