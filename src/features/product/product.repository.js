import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel = mongoose.model("product", productSchema);
const ReviewModel = mongoose.model("reviews", reviewSchema);
const CategoryModel = mongoose.model("category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      productData.categories = productData.category.split(",");
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();
      console.log(productData);
      await CategoryModel.updateMany(
        {
          _id: { $in: productData.categories },
        },
        { $push: { products: new ObjectId(savedProduct._id) } }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      return products;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const product = await collection.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      let filterExpression = {};

      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }

      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0 })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async rateProduct(userID, productID, rating) {
  //   const db = getDB();
  //   const collection = db.collection(this.collection);

  //   try {
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productID),
  //     });
  //     const userRating = product?.ratings?.find((r) => r.userID == userID);

  //     if (userRating) {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //           "ratings.userID": new ObjectId(userID),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //         },
  //         { $push: { ratings: { userID: new ObjectId(userID), rating } } }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async rateProduct(userID, productID, rating) {
    try {
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new ApplicationError("Product not found", 400);
      }

      //user rating exist
      const userRating = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userRating) {
        userRating.rating = rating;
        await userRating.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return db
        .collection(this.collection)
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
