import ClientModel from "../models/clientModel.js";
import * as func from "../config/func.js";
const clientController = {
  // lấy danh sách bạn bè
  getAllFriend: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const user = await ClientModel.getAllFriend(id);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy danh sách bạn bè."
      });
    }
  },
  // lấy lịch sử trò chuyện
  getMessage: async (req, res) => {
    try {
      const { id } = req.user;
      const { type, sender_id, col, idChat } = req.body;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      if (col) {
        if (col == "message") {
          const lastMessage = await ClientModel.getAllMessage(idChat);
          return res
            .status(200)
            .json({ idChat: idChat, chatMessage: lastMessage });
        }
      } else {
        if (!type || !sender_id) {
          return res.status(401).json({
            errorCode: "NO_TOKEN",
            message: "Bạn chưa đăng nhập"
          });
        }
      }
      const message = await ClientModel.getIDMessage(id, sender_id, type);
      // Nếu chưa có chat thì tạo id chat mới
      if (message === null) {
        const createMessage = await ClientModel.createMessage(
          id,
          sender_id,
          func.dateTime()
        );
        return res.status(200).json({ idChat: createMessage, chatMessage: [] });
      }
      const lastMessage = await ClientModel.getAllMessage(message);
      return res
        .status(200)
        .json({ idChat: message, chatMessage: lastMessage });
    } catch (error) {
      console.error("Lỗi khi lấy lich sử trò chuyện:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy lich sử trò chuyện."
      });
    }
  },
  // Lấy toàn bộ lời mời kết bạn
  getAllFriendReq: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const dataFriend = await ClientModel.getAllFriendReq(id);
      return res.status(200).json(dataFriend);
    } catch (error) {
      console.error("Lỗi khi lấy Danh sách yêu cầu kết bạn:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Danh sách yêu cầu kết bạn."
      });
    }
  },
  // Chấp nhận kết bạn
  addFriend: async (req, res) => {
    try {
      const { id } = req.user;
      const { idFriend, idTable } = req.body;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      if (!idFriend || !idTable) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const dataFriend = await ClientModel.addFriend(
        id,
        idFriend,
        func.dateTime()
      );
      const deleteFriend = await ClientModel.deleteFriend(idTable);
      return res.status(200).json({ dataFriend, deleteFriend });
    } catch (error) {
      console.error("Lỗi khi lấy Chấp nhận lời mời kết bạn:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Chấp nhận lời mời kết bạn."
      });
    }
  },
  // Không chấp nhận kết bạn
  deleteFriend: async (req, res) => {
    try {
      const { idTable } = req.body;
      if (!idTable) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const deleteFriend = await ClientModel.deleteFriend(idTable);
      return res.status(200).json({ deleteFriend });
    } catch (error) {
      console.error("Lỗi khi lấy Coa lời mời kết bạn:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Xoa lời mời kết bạn."
      });
    }
  },
  // Lấy toàn bộ bài post
  getAllPost: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const dataPost = await ClientModel.getAllPost(id);
      return res.status(200).json(dataPost);
    } catch (error) {
      console.error("Lỗi khi lấy Bài Post:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Bài Post."
      });
    }
  },
  // Thêm mới Bài Post
  addPost: async (req, res) => {
    try {
      const { id } = req.user;
      const file = req.files;
      const pathImg = file[0]?.path ?? "null";
      const { content } = req.body;
      // const {content}
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      if (!content) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Khong co tieu đề"
        });
      }
      const dataPost = await ClientModel.addPost(
        id,
        content,
        pathImg,
        func.dateTime()
      );
      return res.status(200).json(dataPost);
    } catch (error) {
      console.error("Lỗi khi Thêm Post", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu hêm Post"
      });
    }
  },
  // Lấy toàn bộ thông báo
  getAllNotification: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const dataNotification = await ClientModel.getAllNotification(id);
      return res.status(200).json(dataNotification);
    } catch (error) {
      console.error("Lỗi khi lấy Thông báo:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Thông báo"
      });
    }
  },
  getAllMessageChat: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const user = await ClientModel.getAllMessageChat(id);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Lỗi khi lấy Danh sách phòng chat:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Danh sách phòng chat."
      });
    }
  }
};

export default clientController;
