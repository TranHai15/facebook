import * as func from "./config/func.js";
import ClientModel from "./models/clientModel.js";
import { getSocketServer } from "./socket.js";
export function registerSocketEvents(socket) {
  // Ví dụ: Lắng nghe sự kiện "markNotificationAsRead"
  socket.on("clientEvent", async (data) => {
    const { idRoom: conversation_id, id_send, content } = data;
    const res = await insertMessage(conversation_id, id_send, content);
    const users = await getAllUserByRoomId(conversation_id);
    console.log("🚀 ~ socket.on ~ users:", users);
    const io = getSocketServer();
    users.forEach((user) => {
      if (user.id !== id_send) {
        io.emit(user.id.toString(), {
          idRoom: conversation_id,
          content: content,
          sender_id: id_send,
          username: user.username,
          avatar: user.avatar
        });
      }
    });
  });

  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}

async function insertMessage(conversation_id, id_send, content) {
  try {
    if (!conversation_id || !id_send || !content) {
      console.log("thất bại");
      return { type: false, message: "Thêm tin nhắn thất bại" };
    }
    const res = await ClientModel.insertMessage(
      conversation_id,
      id_send,
      content,
      func.dateTime()
    );
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function getAllUserByRoomId(RoomId) {
  try {
    if (!RoomId) {
      console.log("thất bại");
      return { type: false, message: "Thêm tin nhắn thất bại" };
    }
    const res = await ClientModel.getAllUserByRoomId(RoomId);
    return res;
  } catch (error) {
    console.log(error);
  }
}
