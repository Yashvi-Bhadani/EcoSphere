import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

export const startServer = () => {
  const PORT = process.env.PORT || 5000;

  return app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

