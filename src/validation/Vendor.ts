import Joi from "joi";
import { CreateVendorInput } from "@/dto/Vendor.dto";

export const createVendorValidation = (data: CreateVendorInput) => {
  const schema = Joi.object({
    name: Joi.string(),
    ownerName: Joi.string(),
    pincode: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    serviceavailable: Joi.string(),
    coverImages: Joi.array().items(Joi.string()),
    foodType: Joi.array().items(Joi.string()),
    rating: Joi.number(),
  });

  return schema.validate(data);
};


export const vendorByIdValidation = (data: unknown) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  return schema.validate(data);
};
