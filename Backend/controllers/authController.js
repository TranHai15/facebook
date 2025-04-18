import * as func from "../config/func.js";
import AuthModel from "../models/authModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const authController = {
  // Tạo access token
  createAccessToken: (user) => {
    return jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "3d" }
    );
  },

  // Tạo refresh token
  createRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );
  },
  // Đăng Ký
  register: async (req, res) => {
    try {
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
    } catch (error) {
      console.error("Lỗi khi Đăng Ký:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu Đăng Ký."
      });
    }
  },
  // Đăng Nhập
  login: async (req, res) => {
    try {
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
      await AuthModel.insertSessionById(
        getUser[0]?.id,
        refreshToken,
        func.dateTime()
      );
      const { username, avatar } = getUser[0];

      const user = { name: username, image: avatar };
      return res
        .cookie("refreshToken", refreshToken, {
          maxAge: 604800000,
          httpOnly: true
        })
        .status(200)
        .json({ message: "Đăng nhập thành công", accessToken, user });
    } catch (error) {
      console.error("Lỗi khi Đăng Nhập:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu Đăng Nhập."
      });
    }
  },
  // Đăng Xuất
  logout: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res
          .status(400)
          .json({ message: "Lỗi khi đăng xuất", type: "error" });
      }
      const logout = await AuthModel.logout(id);
      return res.status(200).json({ message: "Đăng Xuất Thành Công" });
    } catch (error) {
      console.error("Lỗi khi Đăng Xuất:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu Đăng Xuất."
      });
    }
  },
  // Cấp lại Token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      // Check xem tồn tại token gửi lên không
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const refreshTokenInDb = await AuthModel.checkSession(id);
      // Lấy giá trị token từ kết quả
      const refreshTokenDB = refreshTokenInDb[0]?.refresh_token;
      // Kiểm tra xem token trong db vs token gui len co khop vs nhau khong
      if (refreshTokenDB !== refreshToken) {
        return res.status(403).json({
          code: "INVALID_REFRESH_TOKEN",
          message: "Token này không phải là của tôi."
        });
      }
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        async (error, user) => {
          if (error) {
            return res.status(403).json({
              code: "REFRESH_TOKEN_EXPIRED",
              message: "Refresh token không hợp lệ hoặc đã hết hạn."
            });
          }
          const newAccessToken = authController.createAccessToken(user);
          const newRefreshToken = authController.createRefreshToken(user);
          const { id } = user;
          // xóa hết phiên đăng nhập cũ đi
          await AuthModel.deleteSessionById(id);
          //  Thêm phiên đăng nhập mới
          await AuthModel.insertSessionById(
            id,
            newRefreshToken,
            func.dateTime()
          );
          return res
            .cookie("refreshToken", newRefreshToken, {
              maxAge: 604800000,
              httpOnly: true
            })
            .status(200)
            .json({ message: "Cấp lại token thành công", newAccessToken });
        }
      );
    } catch (error) {
      console.error("Lỗi khi refresh token:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu refresh token."
      });
    }
  }
};

export default authController;
