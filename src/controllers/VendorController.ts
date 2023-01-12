import { Request, Response } from "express";
import {
  createFoodItemValidation,
  vendorLoginValidation,
  vendorProfileUpdateValidation,
  vendorServiceUpdateValidation,
} from "@/validation/Vendor";
import { EditVendorInput, VendorLoginInput, VendorServiceInput } from "@/dto";
import { Vendor } from "@/models/Vendor";
import { createTokens, validatePassword } from "@/utils/auth-utils";
import { config } from "@/config";
import { Food } from "@/models/Food";

export const VendorLogin = async (req: Request, res: Response) => {
  const { error } = vendorLoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const body = req.body as VendorLoginInput;

  const vendorExist = await Vendor.findOne({ email: body.email });
  if (!vendorExist) {
    return res.json({ message: "Email or password is incorrect" });
  }

  const { password, ...other } = vendorExist.toObject();

  const isValidPassword = await validatePassword(body.password, password);
  if (!isValidPassword)
    return res.status(400).json({ message: "Email or password is incorrect" });

  try {
    const [authToken, refreshToken] = await createTokens(
      other,
      <string>config.AUTH_TOKEN_SECRET,
      <string>config.REFRESH_TOKEN_SECRET
    );

    return res
      .status(200)
      .cookie("auth_token", authToken, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .cookie("refresh_token", refreshToken, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .json({ ...other, status: "success" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const GetVendorProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ message: "vendor not found" });
  }

  const existingVendor = await Vendor.findById(user._id);

  return res.status(200).json(existingVendor);
};

export const UpdateVendorCoverImage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "Authentication error" });

  const vendor = await Vendor.findById(user._id);
  if (!vendor)
    return res
      .status(400)
      .json({ message: "You are not authenticated, login again" });

  try {
    const files = req.files as [Express.Multer.File];

    const images = files.map((file: Express.Multer.File) => file.filename);

    vendor.coverImages.push(...images);

    const updatedVendor = await vendor.save();

    return res
      .status(201)
      .json({ message: "Cover photo added successfully", data: updatedVendor });
  } catch (error) {
    return res.status(400).json({ message: "Fail to add cover photo" });
  }
};

export const UpdateVendorProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res
      .status(400)
      .json({ message: "Unable to Update vendor profile " });
  }

  const payload = <EditVendorInput>req.body;

  const { error } = vendorProfileUpdateValidation(payload);
  if (error) return res.status(400).send(error.details[0]?.message);

  try {
    const existingVendor = await Vendor.findByIdAndUpdate(user._id, payload);
    console.log(existingVendor);
    return res
      .status(201)
      .json({ message: "Vendor profile updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Vendor profile not found" });
  }
};

export const UpdateVendorService = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res
      .status(400)
      .json({ message: "Unable to Update vendor profile " });
  }

  const payload = <VendorServiceInput>req.body;

  const { error } = vendorServiceUpdateValidation(payload);
  if (error) return res.status(400).send(error.details[0]?.message);

  try {
    const existingVendor = await Vendor.findByIdAndUpdate(user._id, payload);
    console.log(existingVendor);
    return res
      .status(201)
      .json({ message: "Vendor service updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Vendor service not found" });
  }
};

export const AddVendorFoods = async (req: Request, res: Response) => {
  const { error } = createFoodItemValidation(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const user = req.user;
  if (!user) return res.status(400).json({ message: "Authentication error" });

  const vendor = await Vendor.findById(user._id);
  if (!vendor)
    return res
      .status(400)
      .json({ message: "You are not authenticated, login again" });

  try {
    const files = req.files as [Express.Multer.File];

    const images = files.map((file: Express.Multer.File) => file.filename);

    const payload = req.body;
    const foodItem = await Food.create({
      vendorId: user._id,
      rating: 0,
      images,
      ...payload,
    });
    vendor.foods.push(foodItem);
    const updatedVendor = await vendor.save();

    return res
      .status(201)
      .json({ message: "Food item added successfully", data: updatedVendor });
  } catch (error) {
    return res.status(400).json({ message: "Fail to add food item" });
  }
};

export const GetVendorFoods = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ message: "vendor not found" });
  }

  const foods = await Vendor.find({ vendorId: user._id });

  return res.status(200).json(foods);
};