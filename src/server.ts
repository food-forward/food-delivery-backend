import express, { Application } from "express";

// routes
import { AdminRoute, VendorRoute } from "./routes";

export const createServer = () => {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);

  return app;
};
