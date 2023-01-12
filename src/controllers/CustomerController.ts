import express, { Request, Response } from "express";

export const CustomerSignUp = async (req: Request, res: Response) => {};
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
