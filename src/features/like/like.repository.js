import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const likeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async likeProduct(userID, productID) {
    try {
      const newLike = new likeModel({
        user: new ObjectId(userID),
        likeable: new ObjectId(productID),
        on_model: "product",
      });
      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async likeCategory(userID, categoryID) {
    try {
      const newLike = new likeModel({
        user: new ObjectId(userID),
        likeable: new ObjectId(categoryID),
        on_model: "category",
      });
      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getLikes(type, id) {
    return await likeModel
      .find({
        likeable: new ObjectId(id),
        on_model: type,
      })
      .populate("user")
      .populate({ path: "likeable", model: type });
  }
}
