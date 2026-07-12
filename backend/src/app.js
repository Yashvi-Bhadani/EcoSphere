import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
<<<<<<< HEAD
import governanceRoutes from "./routes/governanceRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
=======
import environmentRoutes from "./routes/environmentRoutes.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
>>>>>>> main

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

<<<<<<< HEAD
app.use("/api/governance", governanceRoutes);

=======
app.get("/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "EcoSphere API is running",
	});
});

app.use("/api/environment", environmentRoutes);

app.use(notFoundHandler);
>>>>>>> main
app.use(errorHandler);

export default app;