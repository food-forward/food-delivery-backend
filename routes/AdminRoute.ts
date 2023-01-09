import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  DeleteVendor,
  GetVendorById,
  GetVendors,
  UpdateVendor,
} from "@/controllers";

const router = express.Router();

router.post("/vendors", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendors/:id", GetVendorById);
router.patch("/vendors/:id", UpdateVendor);
router.delete("/vendors/:id", DeleteVendor);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
