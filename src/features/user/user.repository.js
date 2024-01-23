import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

const userModel = mongoose.model("user", userSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      const newUser = new userModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async signIn(email, password) {
    try {
      return await userModel.findOne({ email, password });
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async findByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async resetPassword(userID, password) {
    try {
      let user = await userModel.findById(userID);
      user.password = password;
      user.save();
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
