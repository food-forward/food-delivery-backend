import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  UpdateVendorProfile,
  UpdateVendorService,
} from "@/controllers";
import { Authenticate } from "@/middlewares/Authentication";

const router = express.Router();

router.get("/login", VendorLogin);

router.get("/profile", Authenticate, VendorLogin);
router.patch("/profile", Authenticate, UpdateVendorProfile);
router.patch("/servive", Authenticate, UpdateVendorService);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor" });
});
export { router as VendorRoute };
