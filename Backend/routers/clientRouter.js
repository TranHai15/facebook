import express from "express";
import { clientController } from "../controllers/index.js";
import middlewares from "../middlewares/authToken.js";
import multer from "multer";
const Router = express.Router();

// cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/public"); // Lưu vào thư mục uploads/
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename); // Đặt tên file mới để tránh trùng
  }
});

const upload = multer({ storage });

// Lấy danh sách bạn bè
Router.get("/user", middlewares.verifyToken, clientController.getAllFriend);
// Lấy lịch sử trò truyện
Router.post("/chat", middlewares.verifyToken, clientController.getMessage);
// Lấy danh sách kết bạn
Router.get(
  "/friend",
  middlewares.verifyToken,
  clientController.getAllFriendReq
);
// Chấp nhận kết bạn
Router.post("/addFriend", middlewares.verifyToken, clientController.addFriend);
// Xóa kết bạn
Router.post(
  "/deleteFriend",
  middlewares.verifyToken,
  clientController.deleteFriend
);
// Lấy toàn bộ bài post
Router.get("/post", middlewares.verifyToken, clientController.getAllPost);
// thêm post
Router.post(
  "/post",
  upload.array("image", 1),
  middlewares.verifyToken,
  clientController.addPost
);
// Lấy tất cả thông báo
Router.get(
  "/notification",
  middlewares.verifyToken,
  clientController.getAllNotification
);
// Lấy toàn các hội thoại tin nhắn
Router.get(
  "/messageChat",
  middlewares.verifyToken,
  clientController.getAllMessageChat
);

export default Router;
