import express, { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "@/dto";
import {
  createVendorValidation,
  vendorByIdValidation,
} from "@/validation/Vendor";
import { Vendor } from "@/models/Vendor";
import { getEncryptedPassword, getSalt } from "@/utils/auth-utils";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createVendorValidation(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const body = <CreateVendorInput>req.body;

  const vendorExist = await Vendor.findOne({ email: body.email });
  if (vendorExist)
    return res.status(400).send({
      message: "Vendor exist",
    });

  const salt = await getSalt();

  const vendorPassword = await getEncryptedPassword(body.password, salt);

  const vendor = await Vendor.create({ ...body, password: vendorPassword });

  return res.json(vendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  return res.json(vendors);
};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = vendorByIdValidation(req.params);
  if (error) return res.status(400).send(error.details[0]?.message);

  const { id } = req.params;
  const vendor = await Vendor.findById(id);
  if (!vendor)
    return res.status(404).send({ message: `Vendor with id ${id} not found` });

  return res.status(201).send(vendor);
};

export const DeleteVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = vendorByIdValidation(req.params);
  if (error) return res.status(400).send(error.details[0]?.message);

  const { id } = req.params;
  const vendor = await Vendor.findById(id);
  if (!vendor)
    return res.status(404).send({ message: `Vendor with id ${id} not found` });

  await Vendor.findByIdAndDelete(id);
  return res.status(201).send({ message: "Vendor deleted successfully" });
};

export const UpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
