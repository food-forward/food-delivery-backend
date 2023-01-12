import Joi from "joi";
import { CreateCustomerInput, customerVerifyInput } from "@/dto/Customer.dto";

export const createCustomerInputValidator = (payload: CreateCustomerInput) => {
  return Joi.object({
    email: Joi.string().email(),
    phone: Joi.number().max(10),
    password: Joi.string().min(8),
  }).validate(payload);
};

export const customerVerifyValidator = (payload: customerVerifyInput) => {
  return Joi.object({
    otp: Joi.number(),
  }).validate(payload);
};
