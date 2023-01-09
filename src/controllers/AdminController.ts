import express, { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "@/dto";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = <CreateVendorInput>req.body;

  return res.json(body);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const DeleteVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
