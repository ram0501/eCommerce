import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";
const url = process.env.DB_URL;
const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("mongoDB connected using Mongoose");
    addCategories();
  } catch (err) {
    console.log("Errors while connecting to database");
    console.log(err);
  }
};

async function addCategories() {
  const categoryModel = mongoose.model("category", categorySchema);
  const categories = categoryModel.find();
  if (!categories || (await categories).length == 0) {
    await categoryModel.insertMany([
      { name: "Books" },
      { name: "Clothes" },
      { name: "Electronics" },
    ]);
  }
  console.log("Categories Added");
}

export default connectUsingMongoose;
