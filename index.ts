import dotenv from "dotenv";
import "module-alias/register";
import express from "express";
import { AdminRoute, VendorRoute } from "./routes";
import connectDB from "@/config/connect-db";

dotenv.config();

const config = process.env;

const startServer = async () => {
  const app = express();

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await connectDB();

  const PORT = parseInt(<string>config.PORT, 10) || 8000;

  app.listen(PORT, () => {
    console.log(`App is listen on port ${PORT}`);
  });
};

startServer().catch((err) => console.log(err));