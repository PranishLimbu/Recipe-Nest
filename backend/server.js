require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/user.routes");
const recipeRoutes = require("./src/routes/recipe.routes");
const blogRoutes = require("./src/routes/blog.routes");
const authRoutes=require("./src/routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// connect to MongoDB
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});