import { CreateCustomerInput } from "@/dto/Customer.dto";
import { Customer } from "@/models/Customer";
import { generateOtp } from "@/utils";
import { getEncryptedPassword, getSalt } from "@/utils/auth-utils";
import { createCustomerInputValidator } from "@/validation/customer";
import express, { Request, Response } from "express";

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

    return res.status(201).json(customer);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const CustomerLogin = async (req: Request, res: Response) => {};

export const CustomerVerify = async (req: Request, res: Response) => {};

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
