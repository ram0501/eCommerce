import CartController from "./cart.controller.js";

import express from "express";

const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.post("/", (req, res) => cartController.addItem(req, res));
cartRouter.get("/", (req, res) => cartController.getItems(req, res));
cartRouter.delete("/:id", (req, res) => cartController.deleteItem(req, res));

export default cartRouter;
