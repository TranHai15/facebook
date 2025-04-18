import express from "express";
import { authController } from "../controllers/index.js";
import middlewares from "../middlewares/authToken.js";
const Router = express.Router();
// Đăng ký
Router.post("/register", authController.register);
// Đăng Nhập
Router.post("/login", authController.login);
// Đăng xuất
Router.post("/logout", middlewares.verifyToken, authController.logout);
// cấp lại accessToken
Router.post("/refresh", middlewares.getDataToken, authController.refreshToken);

export default Router;
