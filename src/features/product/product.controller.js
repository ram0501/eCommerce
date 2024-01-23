import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, desc, category } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        req.file.filename,
        category,
        parseFloat(price),
        sizes.split(",")
      );
      const recordCreated = await this.productRepository.add(newProduct);
      res.status(201).send(recordCreated);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }
  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send("product not found");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const filteredProducts = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      console.log(filteredProducts);
      res.status(200).send(filteredProducts);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }
  async rateProduct(req, res, next) {
    try {
      const userID = req.userID;
      //console.log(userID);
      const productID = req.body.productID;
      const rating = req.body.rating;

      await this.productRepository.rateProduct(userID, productID, rating);

      res.status(200).send("Rating has been added");
    } catch (err) {
      console.log("calling application level error handler");
      next(err);
    }
  }
  async averagePrice(req, res) {
    try {
      const averagePrice =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(averagePrice);
    } catch (err) {
      console.log("calling application level error handler");
      next(err);
    }
  }
}
