import dotenv from "dotenv";
import "module-alias/register";
import connectDB from "@/config/connect-db";
import { createServer } from "./server";
import { config } from "./config";

dotenv.config();


const startServer = async () => {
  const app = createServer();

  await connectDB();

  const PORT = parseInt(<string>config.PORT, 10) || 8000;

  app.listen(PORT, () => {
    console.log(`App is listen on port ${PORT}`);
  });
};

startServer().catch((err) => console.log(err));
