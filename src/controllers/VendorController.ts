import { Request, Response } from "express";
import { vendorLoginValidation } from "@/validation/Vendor";
import { VendorLoginInput } from "@/dto";
import { Vendor } from "@/models/Vendor";
import { createTokens, validatePassword } from "@/utils/auth-utils";
import { config } from "@/config";

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

export const UpdateVendorProfile = async () => {};

export const GetVendorProfile = async () => {};
