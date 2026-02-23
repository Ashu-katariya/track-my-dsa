const CONFIG = {
  API_BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://track-my-dsa.onrender.com"
};

export default CONFIG;
