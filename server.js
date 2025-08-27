const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/brands", require("./routes/brands"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gift Card API is running" });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

let server;

if (require.main === module) {
  // Only start server if this file is run directly, not when imported for tests
  server = app.listen(PORT, () => {
    console.log(`Gift Card API server is running on port ${PORT}`);
  });
}

module.exports = { app, server };
