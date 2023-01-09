import "module-alias/register";
import express from "express";
import { AdminRoute, VendorRoute } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`App is listen on port ${PORT}`);
});
