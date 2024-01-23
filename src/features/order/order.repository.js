import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      //1. get the cart Items and calculate the total amount
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);
      //  2.create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );

      await db.collection(this.collection).insertOne(newOrder, { session });

      //3. Reduce the stock
      for (let item of items) {
        await db.collection("products").updateOne(
          { _id: item.productID },
          {
            $inc: { stock: -item.quantity },
          },
          { session }
        );
      }

      // 4. clear the user cart
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userId),
        },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // stage 1 :- Get cart Items for a specific user
          {
            $match: { userID: new ObjectId(userId) },
          },
          // stage 2 Get products from products collection
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },

          //stage 3 unwind the product Info
          {
            $unwind: "$productInfo",
          },

          //stage 4 calculate totalAmount for each cartItems

          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();

    console.log(items);
    return items;
  }
}
