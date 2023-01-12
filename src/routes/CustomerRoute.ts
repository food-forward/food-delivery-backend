import express, { Request, Response, NextFunction } from "express";

import {
  AddToCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  VerifyOffer,
} from "@/controllers/";
import { Authenticate } from "@/middlewares/Authentication";

const router = express.Router();

/* ------------------- Suignup / Create Customer --------------------- */
router.post("/signup", CustomerSignUp);

/* ------------------- Login --------------------- */
router.post("/login", CustomerLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Verify Customer Account --------------------- */
router.patch("/verify", CustomerVerify);

/* ------------------- OTP / request OTP --------------------- */
router.get("/otp", RequestOtp);

/* ------------------- Profile --------------------- */
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

export { router as CustomerRoute };
