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
// lấy toan bo bai post cua profile
Router.post(
  "/postProfile",
  middlewares.verifyToken,
  clientController.getAllPostProfile
);
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
// lấy chi tiết bài viết
Router.get(
  "/post/:id",
  middlewares.verifyToken,
  clientController.getDetailPost
);
// thêm comment
Router.post("/comment", middlewares.verifyToken, clientController.addComment);
// thêm like
Router.post("/like", middlewares.verifyToken, clientController.addLike);
// Tìm kiếm
Router.get("/search", middlewares.verifyToken, clientController.searchUsers);
// Profile cá nhân
Router.get(
  "/profile/:id",
  middlewares.verifyToken,
  clientController.getProfile
);
// gửi yêu cầu kết bạn
Router.post(
  "/sendFriendRequest",
  middlewares.verifyToken,
  clientController.sendFriendRequest
);
// chỉnh sửa thông tin profile
Router.post(
  "/postEditProfile",
  middlewares.verifyToken,
  upload.array("image", 1),
  clientController.editProfile
);
export default Router;
