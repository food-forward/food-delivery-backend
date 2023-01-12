import Joi from "joi";
import {
  CreateVendorInput,
  VendorLoginInput,
  EditVendorInput,
  VendorServiceInput,
} from "@/dto/Vendor.dto";

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
    id: Joi.string().hex().length(24).required(),
  });

  return schema.validate(data);
};

export const vendorLoginValidation = (data: VendorLoginInput) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

export const vendorProfileUpdateValidation = (payload: EditVendorInput) => {
  const schema = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    foodType: Joi.array().items(Joi.string()),
  });

  return schema.validate(payload);
};

export const vendorServiceUpdateValidation = (payload: VendorServiceInput) => {
  const schema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required,
  });

  return schema.validate(payload);
};



export const createFoodItemValidation = (payload: any) => {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    foodType: Joi.string(),
    readyTime: Joi.number(),
    price: Joi.number(),
  });

  return schema.validate(payload);
};