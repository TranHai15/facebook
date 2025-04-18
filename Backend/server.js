import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter, clientRouter } from "./routers/index.js";
import { createServer } from "http";
import { startSocketServer } from "./socket.js";

dotenv.config();

// cấu hình đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Khởi tạo Express app
const app = express();

// Cấu hình middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  "/uploads/public",
  express.static(path.join(__dirname, "uploads/public"))
);

// Định nghĩa route mặc định
app.get("/", (req, res) => {
  console.log("Cookies: ", req.cookies);
  res.send("Hello world");
});

// Các router
app.use("/auth", authRouter);
app.use("/", clientRouter);

// Tạo HTTP server sử dụng Express app
const server = createServer(app);

// Lắng nghe port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server của bạn đang chạy tại http://localhost:${PORT}`);
  // Khởi tạo Socket.IO sau khi server đã chạy
  startSocketServer(server);
});
