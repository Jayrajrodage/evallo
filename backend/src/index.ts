import express from "express";
import cors from "cors";
import { createLog, getLogs } from "./controller/logController";
import dotEnv from "dotenv";

dotEnv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["http://localhost:5173", "https://evallo-six.vercel.app"],
  })
);

app.use(express.json());
app.get("/logs", getLogs);
app.post("/logs", createLog);

app.get("/", (_req, res) => {
  res.send("Hello, from API server!");
});

// Start server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
