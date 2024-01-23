import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, imageUrl, category, price, sizes, id) {
    this.name = name;
    this.desc = desc;
    this.imageUrl = imageUrl;
    this.category = category;
    this.price = price;
    this.sizes = sizes;
    this._id = id;
  }

  static rateProduct(userID, productID, rating) {
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      //return "User not found";
      //throw new Error("User not found");
      throw new ApplicationError("User not found", 404);
    }
    const product = products.find((prod) => prod.id == productID);
    if (!product) {
      //return "Product not found";
      //throw new Error("Product not found");
      throw new ApplicationError("Product not found", 400);
    }
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({ userID, rating });
    } else {
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = { userID, rating };
      } else {
        product.ratings.push({ userID, rating });
      }
    }
  }
}

var products = [];
