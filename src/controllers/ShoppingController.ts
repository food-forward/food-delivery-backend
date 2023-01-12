import express, { Request, Response } from "express";
import { Vendor } from "@/models/Vendor";
import { FoodDoc } from "@/models/Food";

export const GetFoodAvailability = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (!result)
    return res.status(400).json({ message: "Fail to get available foods" });

  return res.status(200).json(result);
};

export const GetTopRestaurants = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (!result)
    return res.status(400).json({ message: "Fail to get restaurants" });

  return res.status(200).json(result);
};

export const GetFoodsIn30Min = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");
  if (!result)
    return res.status(400).json({ message: "Fail to get 30mins ready foods" });

  let foodResult: FoodDoc[] = [];
  result.map((vendor) => {
    const foods = vendor.foods as [FoodDoc];
    foodResult.push(...foods.filter((food) => food.readyTime <= 30));
  });
  return res.status(200).json(foodResult);
};

export const SearchFoods = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (!result) return res.status(400).json({ message: "Fail to get foods" });

  let foodResult: any = [];
  result.map((item) => foodResult.push(...item.foods));
  return res.status(200).json(foodResult);
};

export const RestaurantById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate("foods");

  return res.status(200).json(result);
};

export const GetAvailableOffers = async (req: Request, res: Response) => {};
