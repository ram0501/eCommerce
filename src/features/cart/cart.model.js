import UserModel from "../user/user.model.js";
import ProductModel from "../product/product.model.js";

export default class CartModel {
  constructor(userID, productID, quantity, id) {
    this._id = id;
    this.userID = userID;
    this.productID = productID;
    this.quantity = quantity;
  }

  static get(userID) {
    return cartItems.filter((item) => item.userID == userID);
  }

  static delete(userID, cartItemID) {
    const itemIndex = cartItems.findIndex(
      (i) => i.id == cartItemID && i.userID == userID
    );
    if (itemIndex == -1) {
      return "Item not found";
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
}

let cartItems = [new CartModel(1, 2, 1, 2), new CartModel(2, 1, 2, 5)];
