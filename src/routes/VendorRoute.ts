import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  UpdateVendorProfile,
  UpdateVendorService,
  AddVendorFoods,
  GetVendorFoods,
  UpdateVendorCoverImage,
} from "@/controllers";
import { Authenticate } from "@/middlewares/Authentication";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.get("/login", VendorLogin);

router.get("/profile", Authenticate, VendorLogin);
router.patch("/profile", Authenticate, UpdateVendorProfile);
router.patch("/servive", Authenticate, UpdateVendorService);
router.patch("/cover-photo", Authenticate, images, UpdateVendorCoverImage);


router.post("/foods", Authenticate, images, AddVendorFoods);
router.get("/foods", Authenticate, GetVendorFoods);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor" });
});
export { router as VendorRoute };
