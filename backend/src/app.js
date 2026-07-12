import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import governanceRoutes from "./routes/governanceRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/governance", governanceRoutes);

app.use(errorHandler);

export default app;