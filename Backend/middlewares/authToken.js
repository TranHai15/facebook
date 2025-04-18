import jwt from "jsonwebtoken";
const middlewares = {
  // Kiểm tra xem đăng nhập chưa
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization;
    //   Kiểm tra xem có tồn tại token gửi lên không
    if (!token) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập.",
        errorCode: "NO_TOKEN"
      });
    }

    // kiểm tra các trường hợp của token
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (error, user) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token đã hết hạn.",
            errorCode: "TOKEN_EXPIRED"
          });
        } else if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            message: "Token không hợp lệ.",
            errorCode: "INVALID_TOKEN"
          });
        } else if (error.name === "NotBeforeError") {
          return res.status(401).json({
            message: "Token chưa có hiệu lực.",
            errorCode: "TOKEN_NOT_ACTIVE"
          });
        } else {
          return res.status(400).json({
            message: "Lỗi xác thực token.",
            error: error.message
          });
        }
      }
      req.user = user; // Token hợp lệ, gán user vào req
      next();
    });
  },
  //   Lấy thông tin từ token khi cấp lại accessToken
  getDataToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ errorCode: "NO_REFRESH_TOKEN", message: "Bạn chưa đăng nhập" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (error, user) => {
      if (error) {
        console.log("Loi o check token middlwere", error);
        return res
          .status(401)
          .json({
            errorCode: "NO_REFRESH_TOKEN",
            message: "Bạn chưa đăng nhập"
          });
      }
      req.user = user; // Token hợp lệ, gán user vào req
      next();
    });
  }
};

export default middlewares;
