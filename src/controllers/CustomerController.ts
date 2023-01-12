import { Request, Response } from "express";
import { config } from "@/config";
import { CreateCustomerInput } from "@/dto/Customer.dto";
import { Customer } from "@/models/Customer";
import { generateOtp, onRequestOTP, createTokens } from "@/utils";
import { getEncryptedPassword, getSalt } from "@/utils/auth-utils";
import {
  createCustomerInputValidator,
  customerVerifyValidator,
} from "@/validation/customer";

export const CustomerSignUp = async (req: Request, res: Response) => {
  const { error } = createCustomerInputValidator(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const body = <CreateCustomerInput>req.body;

  const vendorExist = await Customer.findOne({ email: body.email });
  if (vendorExist)
    return res.status(400).send({
      message: "Email already exist",
    });

  const salt = await getSalt();

  const customerPassword = await getEncryptedPassword(body.password, salt);

  const { otp, otp_expity } = generateOtp();

  try {
    const customer = await Customer.create({
      ...body,
      otp,
      otp_expity,
      password: customerPassword,
    });
    await onRequestOTP(otp, body.phone);

    //Generate the Signature
    const [authToken, refreshToken] = await createTokens(
      {
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      },
      <string>config.AUTH_TOKEN_SECRET,
      <string>config.REFRESH_TOKEN_SECRE
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
      .json({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
        status: "success",
      });
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const CustomerLogin = async (req: Request, res: Response) => {};

export const CustomerVerify = async (req: Request, res: Response) => {
  const { error } = customerVerifyValidator(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const { otp } = req.body;
  const customer = req.user;

  if (!customer)
    return res
      .status(400)
      .json({ message: "Authentication error, try to login again" });

  const profile = await Customer.findById(customer._id);
  if (!profile)
    return res.status(400).json({ message: "Unable to verify Customer" });

  if (profile.otp_expiry < new Date())
    return res.status(400).json({ message: "Token expired" });

  if (profile.otp !== parseInt(otp))
    return res.status(400).json({ message: "Invalid token" });

  // Update verified field
  profile.verified = true;
  const updatedCustomerResponse = await profile.save();

  const [authToken, refreshToken] = await createTokens(
    {
      _id: updatedCustomerResponse._id,
      email: updatedCustomerResponse.email,
      verified: updatedCustomerResponse.verified,
    },
    <string>config.AUTH_TOKEN_SECRET,
    <string>config.REFRESH_TOKEN_SECRE
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
    .json({
      _id: updatedCustomerResponse._id,
      email: updatedCustomerResponse.email,
      verified: updatedCustomerResponse.verified,
      status: "success",
    });
};

export const RequestOtp = async (req: Request, res: Response) => {};

export const GetCustomerProfile = async (req: Request, res: Response) => {};

export const EditCustomerProfile = async (req: Request, res: Response) => {};

/* ------------------- Delivery Notification --------------------- */

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {};

/* ------------------- Order Section --------------------- */

const validateTransaction = async (txnId: string) => {};

export const CreateOrder = async (req: Request, res: Response) => {};

export const GetOrders = async (req: Request, res: Response) => {};

export const GetOrderById = async (req: Request, res: Response) => {};

/* ------------------- Cart Section --------------------- */
export const AddToCart = async (req: Request, res: Response) => {};

export const GetCart = async (req: Request, res: Response) => {};

export const DeleteCart = async (req: Request, res: Response) => {};

export const VerifyOffer = async (req: Request, res: Response) => {};

export const CreatePayment = async (req: Request, res: Response) => {};
