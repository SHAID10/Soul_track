require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const churchRoutes = require("./routes/churchRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware: parse incoming JSON request bodies, allow requests from the frontend
app.use(express.json());
app.use(cors());

// Feature routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/church", churchRoutes);

// Simple health check route to confirm the server is alive
app.get("/", (req, res) => {
  res.json({ message: "SoulTrack backend is running" });
});

// Centralized error handler — must be the LAST app.use()
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// sync() creates the SQLite tables based on our models if they don't exist yet.
// We only need { force: true } the very first time or when resetting the DB —
// leaving it off preserves existing data on restart.
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});