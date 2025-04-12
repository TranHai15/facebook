import express from "express";
import { authController } from "../controllers/index.js";

const Router = express.Router();
// Đăng ký
Router.post("/register", authController.register);
// Đăng Nhập
Router.post("/login", authController.login);

export default Router;
