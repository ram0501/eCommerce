import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async userSignUp(req, res) {
    try {
      const { name, email, password, type } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }

  async userSignIn(req, res) {
    const { email, password } = req.body;
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign(
          { userID: user._id, userEmail: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).send(token);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } else {
      res.status(400).send("Invalid Credentials");
    }
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password Updated");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong", 503);
    }
  }
}
