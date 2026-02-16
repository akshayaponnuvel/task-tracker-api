import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import healthRoutes from "./routes/health.route";
import taskRoutes from "./routes/task.route";
import dotenv from "dotenv";


const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
