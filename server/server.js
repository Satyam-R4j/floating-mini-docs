import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";

// Load configuration env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

// Auto-create uploads directory if missing
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// Root route status check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "Doddle Docs Backend API" });
});

// Connect to MongoDB & Start Server
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doddle_docs";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("-----------------------------------------");
    console.log("Successfully connected to MongoDB database");
    app.listen(PORT, () => {
      console.log(`Doddle Docs Server running on port: ${PORT}`);
      console.log("-----------------------------------------");
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error: ", error.message);
    process.exit(1);
  });
