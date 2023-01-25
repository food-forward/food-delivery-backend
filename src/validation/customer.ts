import Joi from "joi";
import {
  CartItems,
  CreateCustomerInput,
  customerVerifyInput,
  OrderInputs,
} from "@/dto/Customer.dto";

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

export const customerLoginInputValidator = (payload: CreateCustomerInput) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(payload);
};

export const editCustomerInputValidator = (payload: CreateCustomerInput) => {
  return Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: Joi.string(),
  }).validate(payload);
};

// export const customerOrderValidation = (payload: OrderInputs) => {
//   return Joi.object({
//     txnId: Joi.string(),
//     amount: Joi.string(),
//     items: Joi.array().items({
//       _ui: Joi.string(),
//       unit: Joi.string(),
//     }),
//   }).validate(payload);
// };

export const customerOrderValidation = (payload: CartItems[]) => {
  return Joi.array()
    .items({
      _ui: Joi.string(),
      unit: Joi.string(),
    })
    .validate(payload);
};