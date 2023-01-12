import { number } from "joi";

export interface CreateCustomerInput {
  email: string;
  phone: string;
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface customerVerifyInput {
  otp: number;
}
