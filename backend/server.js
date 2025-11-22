const express = require("express");
const app = express();

const PORT = 3000;

// Simple route to test server
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TrackMyDSA backend is running",
    time: new Date().toISOString(),
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
