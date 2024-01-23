import express from "express";
import ProductController from "./product.controller.js";
import fileupload from "../../middlewares/fileupload.middleware.js";

const productRouter = express.Router();

const productContoller = new ProductController();

productRouter.get("/", (req, res) => productContoller.getAllProducts(req, res));
productRouter.post("/", fileupload.single("imageUrl"), (req, res) =>
  productContoller.addProduct(req, res)
);
productRouter.get("/filter", (req, res) =>
  productContoller.filterProducts(req, res)
);
productRouter.get("/averagePrice", (req, res) =>
  productContoller.averagePrice(req, res)
);
productRouter.get("/:id", (req, res) =>
  productContoller.getOneProduct(req, res)
);
productRouter.post("/rate", (req, res, next) =>
  productContoller.rateProduct(req, res, next)
);

export default productRouter;
