import express, { Request, Response } from "express";
import { Vendor } from "@/models/Vendor";

export const GetFoodAvailability = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (!result)
    return res.status(400).json({ message: "Fail to get available food" });

  return res.status(200).json(result);
};

export const GetTopRestaurants = async (req: Request, res: Response) => {};

export const GetFoodsIn30Min = async (req: Request, res: Response) => {};

export const SearchFoods = async (req: Request, res: Response) => {};

export const RestaurantById = async (req: Request, res: Response) => {};

export const GetAvailableOffers = async (req: Request, res: Response) => {};
