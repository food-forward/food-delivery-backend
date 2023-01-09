import mongoose from "mongoose";

const connectDB = () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.MONGODB_CONNECTION_URL || "").then(() => {
    console.log("Connected to the database ");
  });
};

export default connectDB;
