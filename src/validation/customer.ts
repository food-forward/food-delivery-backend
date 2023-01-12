import { CreateCustomerInput } from "@/dto/Customer.dto";
import Joi from "joi";

export const createCustomerInputValidator = (payload: CreateCustomerInput) => {
  return Joi.object({
    email: Joi.string().email(),
    phone: Joi.number().max(10),
    password: Joi.string().min(8),
  }).validate(payload);
};
