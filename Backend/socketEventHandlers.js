import * as func from "./config/func.js";
import ClientModel from "./models/clientModel.js";
import { getSocketServer } from "./socket.js";
export function registerSocketEvents(socket) {
  // Ví dụ: Lắng nghe sự kiện "markNotificationAsRead"
  socket.on("clientEvent", async (data) => {
    const { idRoom: conversation_id, id_send, content } = data;
    const res = await insertMessage(conversation_id, id_send, content);
    const users = await getAllUserByRoomId(conversation_id);
    const sendUser = users?.find((user) => user.id === id_send);
    const toUser = users.filter((user) => user.id !== id_send);
    toUser.forEach(async (user) => {
      await ClientModel.addNotification(
        sendUser?.id,
        "message",
        user.id,
        null,
        1,
        content,
        func.dateTime()
      );
    });
    const io = getSocketServer();
    users.forEach((user) => {
      if (user.id !== id_send) {
        io.emit(user.id.toString(), {
          idRoom: conversation_id,
          content: content,
          sender_id: sendUser.id,
          username: sendUser.username,
          avatar: sendUser.avatar
        });
      }
    });
  });
  socket.on("readMessage", async (data) => {
    const { idChat, userId } = data;
    if (idChat) {
      const res = await ClientModel.markNotificationAsRead(idChat, userId);
    }
  });
  socket.on("readNotification", async (data) => {
    const { id, user_id } = data;
    if (id) {
      const res = await ClientModel.markNotificationAsReadNof(id);
      const idMen = `${user_id.toString()}abc`;
      const io = getSocketServer();
      io.emit(idMen, {
        type: "info"
      });
    }
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
      func.dateTime(),
      1
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
