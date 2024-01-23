import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";

export default class CartRepository {
  constructor() {
    this.collection = "cartItems";
  }
  //add Item to the cart
  async add(userID, productID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      await collection.updateOne(
        {
          userID: new ObjectId(userID),
          productID: new ObjectId(productID),
        },
        { $setOnInsert: { _id: id }, $inc: { quantity: quantity } },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const items = await collection
        .find({ userID: new ObjectId(userID) })
        .toArray();
      return items;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async delete(itemID, userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(itemID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getNextCounter(db) {
    const result = await db.collection("counters").findOneAndUpdate(
      { _id: "cartItemId" },
      {
        $inc: { value: 1 },
      },
      {
        returnDocument: "after",
      }
    );
    console.log(result.value);
    return result.value;
  }
}
