import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }

  async likeItem(req, res) {
    try {
      const { id, type } = req.body;
      if (type != "product" && type != "category") {
        return res.status(400).send("Invalid");
      }
      if (type == "product") {
        await this.likeRepository.likeProduct(req.userID, id);
      } else {
        await this.likeRepository.likeCategory(req.userID, id);
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
    res.status(201).send("like created");
  }
}
