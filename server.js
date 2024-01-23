import "./env.js";
import express from "express";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import connectUsingMongoose from "./src/config/mongooseConfig.js";
import likeRouter from "./src/features/like/like.routes.js";

const server = express();

// var corsOptions = {
//   origin: "http://localhost:5500/",
// };

server.use(cors());

// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
//   res.header("Access-Control-Allow-heaader", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

server.use(bodyParser.json());
//another parser is
//server.use(express.json())

server.get("/", (req, res) => {
  res.send("Welcome to API Building Application");
});
server.use(loggerMiddleware);
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes", jwtAuth, likeRouter);

server.use((err, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  console.log(err);
  res.status(500).send("Something went wrong Please try later");
});

server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found . Please use our documentation for information at localhost:5000/api-docs"
    );
});

server.listen(5000, () => {
  console.log("Server is listening at port number 5000");
  //connectToMongoDB();
  connectUsingMongoose();
});
