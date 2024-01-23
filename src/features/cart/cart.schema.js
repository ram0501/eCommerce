import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  quantity: Number,
});
