import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", (req, res) => userController.userSignUp(req, res));
userRouter.post("/signin", (req, res) => userController.userSignIn(req, res));
userRouter.put("/resetPassword", jwtAuth, (req, res) =>
  userController.resetPassword(req, res)
);

export default userRouter;
