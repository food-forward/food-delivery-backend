import { Request, Response } from "express";
import { config } from "@/config";
import { CreateCustomerInput } from "@/dto/Customer.dto";
import { Customer } from "@/models/Customer";
import { generateOtp, onRequestOTP, createTokens } from "@/utils";
import {
  getEncryptedPassword,
  getSalt,
  validatePassword,
} from "@/utils/auth-utils";
import {
  createCustomerInputValidator,
  customerLoginInputValidator,
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

export const CustomerLogin = async (req: Request, res: Response) => {
  const { error } = customerLoginInputValidator(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const { email, password } = req.body;
  const customer = await Customer.findOne({ email: email });
  if (!customer)
    return res.status(400).json({ message: "Email or password is incorrect" });

  const isValidPassword = await validatePassword(password, customer.password);
  if (!isValidPassword)
    return res.status(400).json({ message: "Email or password is incorrect" });

  try {
    const [authToken, refreshToken] = await createTokens(
      {
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      },
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
      .json({
        email: customer.email,
        verified: customer.verified,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};

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
    .json({
      _id: updatedCustomerResponse._id,
      email: updatedCustomerResponse.email,
      verified: updatedCustomerResponse.verified,
      status: "success",
    });
};



export const RequestOtp = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer)
    return res
      .status(400)
      .json({ message: "Authentication error, try to login again" });

  const profile = await Customer.findById(customer._id);
  if (!profile)
    return res
      .status(400)
      .json({ message: "Authentication error, try to login again" });

  const { otp, otp_expity } = generateOtp();
  profile.otp = otp;
  profile.otp_expiry = otp_expity;

  await profile.save();
  await onRequestOTP(otp, profile.phone);

  return res
    .status(200)
    .json({ message: "OTP sent to your registered Mobile Number!" });
};

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
