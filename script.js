console.log("TrackMyDSA loaded successfully");
const btn = document.getElementById("get-started-btn");

if (btn) {
  btn.addEventListener("click", () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}
