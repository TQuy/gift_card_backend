const express = require("express");

const app = express();
const PORT = 3001;

// Test basic routes
app.get("/test", (req, res) => {
  res.json({ message: "Basic route works" });
});

app.get("/test/:id", (req, res) => {
  res.json({ message: "Param route works", id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
