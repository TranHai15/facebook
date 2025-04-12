import * as func from "../config/func.js";
import AuthModel from "../models/authModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const authController = {
  // Tạo access token
  createAccessToken: (user) => {
    console.log("🚀 ~ user:", user);
    return jwt.sign(
      { email: user.email, is_admin: user.is_admin },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "3h" }
    );
  },

  // Tạo refresh token
  createRefreshToken: (user) => {
    console.log("🚀 ~ user:", user);
    return jwt.sign(
      { email: user.email, is_admin: user.is_admin },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );
  },

  register: async (req, res) => {
    const { fullname, email, password } = req.body.data;
    const error = {};
    if (!fullname || fullname.length < 4) {
      error.fullname = "Vui Lòng Nhập Tên và dài hơn 4 ký tự";
    }
    if (!email || !func.isValidEmail(email)) {
      error.email = "Vui Lòng Nhập email và đúng định dạng";
    }
    if (!password || password.length < 5) {
      error.password = "Vui Lòng Nhập mật khẩu và dài hơn 6 ký tự";
    }
    if (Object.keys(error).length > 0) {
      return res.status(400).json(error);
    }
    // Kiểm tra xem đã tồn tại email chưa
    const isEmail = await AuthModel.isEmail(email);

    if (isEmail[0]?.so_luong > 0) {
      error.email = "Email đã tồn tại";
      return res.status(400).json(error);
    }
    //  Băm mật khẩu
    const salt = await bcryptjs.genSalt(10);
    const passwordHas = await bcryptjs.hash(password, salt);
    // ảnh mặc định khi đăng ký tài khoản
    const avatar =
      "https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-mac-dinh-12-1724862391.jpg";
    let created_at = func.dateTime();
    const register = await AuthModel.register(
      fullname,
      email,
      passwordHas,
      avatar,
      0,
      created_at
    );
    if (register.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Đăng ký thành công", type: "success" });
    } else {
      return res
        .status(400)
        .json({ message: "Đăng ký thất bại", type: "error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body.data;
    const error = {};
    if (!email || !func.isValidEmail(email)) {
      error.email = "Vui Lòng Nhập email và đúng định dạng";
    }
    if (!password || password.length < 5) {
      error.password = "Vui Lòng Nhập mật khẩu và dài hơn 6 ký tự";
    }
    if (Object.keys(error).length > 0) {
      return res.status(400).json(error);
    }
    // Kiểm tra xem đã tồn tại user trong db không
    const getUser = await AuthModel.isEmail(email, true);
    if (getUser.length <= 0) {
      error.email = "Tài khoản không tồn tại";
      return res.status(400).json(error);
    }
    //  Kiểm tra xem khớp mật khẩu không
    const isPasswordValid = await bcryptjs.compare(
      password,
      getUser[0]?.password
    );
    if (!isPasswordValid) {
      error.password = "Sai mật khẩu";
      return res.status(400).json(error);
    }
    await AuthModel.deleteSessionById(getUser[0]?.id);

    let accessToken = authController.createAccessToken(getUser[0]);
    let refreshToken = authController.createRefreshToken(getUser[0]);
    console.log("🚀 ~ login: ~ refreshToken:", refreshToken);
    await AuthModel.insertSessionById(
      getUser[0]?.id,
      refreshToken,
      func.dateTime()
    );
    return res
      .cookie("refreshToken", refreshToken, {
        maxAge: 604800000,
        httpOnly: true
      })
      .status(200)
      .json({ message: "Đăng nhập thành công", accessToken });
  }
};

export default authController;
