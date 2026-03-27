const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require("./routes/drawRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

module.exports = app;
