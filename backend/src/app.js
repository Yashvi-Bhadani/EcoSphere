import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import governanceRoutes from "./routes/governanceRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import environmentRoutes from "./routes/environmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
<<<<<<< HEAD
    message: "EcoSphere API is running",
  });
});

app.use("/api/governance", governanceRoutes);
app.use("/api/governance/policies", policyRoutes);
=======
    message: "EcoSphere API is running"
  });
});

app.use("/api/v1/auth", authRoutes);
>>>>>>> main
app.use("/api/environment", environmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;