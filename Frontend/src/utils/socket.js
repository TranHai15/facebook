// utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token = null) => {
  if (!socket && token) {
    socket = io(import.meta.env.VITE_API_SOCKET || "http://localhost:3000", {
      transports: ["websocket"]
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("❌ Socket disconnected");
    socket = null;
  }
};
