import { Request, Response } from "express";
import { config } from "@/config";
import {
  CartItems,
  CreateCustomerInput,
  OrderInputs,
} from "@/dto/Customer.dto";
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
  customerOrderValidation,
  customerVerifyValidator,
  editCustomerInputValidator,
} from "@/validation/customer";
import { Food } from "@/models/Food";
import { Order } from "@/models/Order";

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

export const GetCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer)
    return res
      .status(400)
      .json({ message: "Authentication error, try to login again" });

  try {
    const profile = await Customer.findById(customer._id);

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const EditCustomerProfile = async (req: Request, res: Response) => {
  const { error } = editCustomerInputValidator(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const customer = req.user;
  if (!customer)
    return res
      .status(400)
      .json({ message: "Authentication error, try to login again" });

  const { firstName, lastName, address } = req.body;

  try {
    const profile = await Customer.findById(customer._id);
    if (!profile)
      return res
        .status(400)
        .json({ message: "Authentication error, try to login again" });

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;
    const result = await profile.save();

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
};

/* ------------------- Delivery Notification --------------------- */

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {};

/* ------------------- Order Section --------------------- */

const validateTransaction = async (txnId: string) => {};

export const CreateOrder = async (req: Request, res: Response) => {
  const customer = req.user;

  if (!customer)
    return res.status(403).json({
      message: "Authentication error, please login and try again",
    });

  const cart = <[CartItems]>req.body;

  const { error } = customerOrderValidation(cart);
  if (error) return res.json(403).send(error.details[0]?.message);

  const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

  const profile = await Customer.findById(customer._id);
  if (!profile)
    return res.json(403).json({
      message: "User not found",
    });

  let cartItems = Array();

  let netAmount = 0.0;

  let vendorId;

  const foods = await Food.find()
    .where("_id")
    .in(cart.map((item) => item._id))
    .exec();

  foods.map((food) => {
    cart.map(({ _id, unit }) => {
      if (food._id == _id) {
        vendorId = food.vendorId;
        netAmount += food.price * unit;
        cartItems.push({ food, unit });
      }
    });
  });

  if (cartItems.length === 0)
    return res.status(403).json({ message: "Food item not found" });

  const currentOrder = await Order.create({
    orderId: orderId,
    vendorId: vendorId,
    items: cartItems,
    totalAmount: netAmount,
    orderDate: new Date(),
    orderStatus: "Waiting",
    remarks: "",
    deliveryId: "",
    readyTime: 45,
  });

  profile.cart = [] as any;
  profile.orders.push(currentOrder);

  await profile.save();

  return res.status(200).json(currentOrder);
};

export const GetOrders = async (req: Request, res: Response) => {
  const customer = req.user;

  if (!customer)
    return res.status(403).json({
      message: "Authentication error, please login and try again",
    });

  const profile = await Customer.findById(customer._id).populate("orders");
  if (!profile)
    return res.json(403).json({
      message: "User not found",
    });

  return res.status(200).json(profile.orders);
};

export const GetOrderById = async (req: Request, res: Response) => {};

/* ------------------- Cart Section --------------------- */
export const AddToCart = async (req: Request, res: Response) => {};

export const GetCart = async (req: Request, res: Response) => {};

export const DeleteCart = async (req: Request, res: Response) => {};

export const VerifyOffer = async (req: Request, res: Response) => {};

export const CreatePayment = async (req: Request, res: Response) => {};
