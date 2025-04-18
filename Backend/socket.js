import { Server } from "socket.io";
import { registerSocketEvents } from "./socketEventHandlers.js";
import dotenv from "dotenv";
dotenv.config();

let io; // Lưu tham chiếu đến đối tượng Socket.IO

/**
 * Khởi tạo Socket.IO cho HTTP server hiện có.
 * @param {import("http").Server} server - HTTP server hiện tại
 * @returns {import("socket.io").Server} - Đối tượng io được khởi tạo
 */
export function startSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.API__FE || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Lắng nghe sự kiện kết nối của client
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Ủy quyền xử lý các sự kiện cho socket qua file socketEventHandlers.js
    registerSocketEvents(socket);
  });

  console.log("Socket server started");
  return io;
}

/**
 * Hàm truy xuất đối tượng io đã khởi tạo (nếu có).
 * @returns {import("socket.io").Server} - Đối tượng io
 */
export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server chưa được khởi tạo!");
  }
  return io;
}
