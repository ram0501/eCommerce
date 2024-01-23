import { ObjectId } from "mongodb";
import CartModel from "./cart.model.js";
import CartRepository from "./cart.respository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }
  async addItem(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;

      //const newItem = new CartModel(userID, productID, quantity);
      await this.cartRepository.add(userID, productID, quantity);
      res.status(201).send("Item added");
    } catch (err) {
      return res.status(200).send("Something went wrong");
    }
  }

  async getItems(req, res) {
    try {
      const items = await this.cartRepository.get(req.userID);
      res.status(200).json(items);
    } catch (err) {
      return res.status(200).send("Something went wrong");
    }
  }

  async deleteItem(req, res) {
    const cartItemID = req.params.id;
    const isDeleted = await this.cartRepository.delete(cartItemID, req.userID);
    console.log(isDeleted);
    if (!isDeleted) {
      return res.status(404).send("Item is not found");
    } else {
      res.status(200).send("Item Deleted");
    }
  }
}
