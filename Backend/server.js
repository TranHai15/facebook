//  file chạy chính server

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routers/index.js";
// cấu hình các đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// nạp các .env vào process.env
dotenv.config();

// Khởi tạo ứng dụng Express – dùng để xây dựng API và xử lý request/response.
const app = express();
// Cho phép Cross-Origin Resource Sharing – giúp client và server khác domain/port có thể giao tiếp.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
// cho phép lấy cookie từ gửi lên
app.use(cookieParser());
// để sử dụng json khi gửi lên
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads/public")));
app.get("/", (req, res) => {
  console.log("Cookies: ", req.cookies);
  res.send("hello word");
});

//  router
app.use("/auth", authRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, (req, res) => {
  console.log(`server cua ban dang chay tren http://localhost:3000`);
});
