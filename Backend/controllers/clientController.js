import ClientModel from "../models/clientModel.js";
import * as func from "../config/func.js";
import { getSocketServer } from "../socket.js";
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
      const deleteFriend = await ClientModel.acceptedFriend(idTable);
      await ClientModel.addNotification(
        id,
        "friend_accept",
        idFriend,
        null,
        1,
        "Đã chấp nhận lời mời kết bạn",
        func.dateTime()
      );
      const io = getSocketServer();
      const idMen = `${idFriend.toString()}abc`;
      io.emit(idMen, {
        type: "chap"
      });
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
      const { id } = req.user;
      const { idTable, id_friend } = req.body;
      if (!idTable) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const deleteFriend = await ClientModel.deleteFriend(idTable);
      await ClientModel.deleteFriendRequestNotification(id, id_friend);
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
  // Lấy toàn bộ bài post của profile
  getAllPostProfile: async (req, res) => {
    try {
      const { idProfile } = req.body;
      console.log("🚀 ~ getAllPostProfile: ~ id:", idProfile);
      if (!idProfile) {
        return res.status(401).json({
          errorCode: "NO_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const dataPost = await ClientModel.getAllPost(idProfile);
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
      // console.log("🚀 ~ addPost: ~ dataPost:", dataPost[0]?.insertId);
      const io = getSocketServer();
      const users = await ClientModel.getAllFriend(id);

      users.forEach(async (user) => {
        await ClientModel.addNotification(
          id,
          "post",
          user.id,
          dataPost[0]?.insertId,
          1,
          content,
          func.dateTime()
        );
        const idMen = `${user.id.toString()}abc`;
        io.emit(idMen, {
          type: "post"
        });
      });
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
  // lấy danh sách phòng chat
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
  },
  // lấy chi tiết bài viết
  getDetailPost: async (req, res) => {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const { id: idPost } = req.params;
      if (!idPost) {
        return res.status(401).json({
          errorCode: "NO_POST",
          message: "Không có bài viết nào"
        });
      }
      const post = await ClientModel.getPostById(idPost);
      const comments = await ClientModel.getCommentByPostId(idPost);
      const likes = await ClientModel.getLikeByPostId(idPost);
      const data = {
        post: post,
        comments: comments,
        likes: likes
      };
      return res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy Danh sách phòng chat:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy Danh sách phòng chat."
      });
    }
  },
  //  Thêm comment
  addComment: async (req, res) => {
    try {
      const { id } = req.user;
      const { content, post_id, id_send, id_user } = req.body;
      // id của người comment
      // console.log("🚀 ~ addComment: ~ id_send:", id_send);
      // id của người nhận đc comment thông báo
      // console.log("🚀 ~ addComment: ~ id_user:", id_user);

      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      if (!content || !post_id || !id_send || !id_user) {
        return res.status(401).json({
          errorCode: "NO_COMMENT",
          message: "Không có nội dung comment"
        });
      }
      const dataComment = await ClientModel.addComment(
        post_id,
        id_send,
        content,
        func.dateTime()
      );
      console.log("sss", id_user != id_send);
      if (id_user != id_send) {
        // id khac nhau
        console.log("message id khac nhau");
        const addNotification = await ClientModel.addNotification(
          id_send,
          "comment",
          id_user,
          post_id,
          1,
          content,
          func.dateTime()
        );
      }
      const io = getSocketServer();
      io.emit(id_send.toString(), {
        type: "comment",
        post_id: post_id
      });
      const idMen = `${id_user.toString()}abc`;
      io.emit(idMen, {
        type: "comment",
        post_id: post_id
      });

      return res.status(200).json(post_id);
    } catch (error) {
      console.error("Lỗi khi thêm comment:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu thêm comment."
      });
    }
  },
  // Thêm like
  addLike: async (req, res) => {
    try {
      const { id } = req.user;
      const { id_post, id_to, type } = req.body;
      console.log("🚀 ~ addLike: ~ type:", type);
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      if (!id_post || !id_to) {
        return res.status(401).json({
          errorCode: "NO_COMMENT",
          message: "Không có nội dung comment"
        });
      }
      const like = await ClientModel.addLike(
        id_post,
        id,
        func.dateTime(),
        type
      );
      if (type == false) {
        if (id !== id_to) {
          const addNotification = await ClientModel.addNotification(
            id,
            "like",
            id_to,
            id_post,
            1,
            "Thích bài viết của bạn",
            func.dateTime()
          );
        }
      }
      const io = getSocketServer();
      const idMen = `${id_to.toString()}abc`;
      io.emit(idMen, {
        type: "like",
        type: type,
        id_post: id_post
      });
      io.emit(id.toString(), {
        type: "like",
        type: type,
        id_post: id_post
      });
      return res.status(200).json();
    } catch (error) {
      console.error("Lỗi khi thêm like:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu thêm like."
      });
    }
  },
  // tim kiếm theo tên
  searchUsers: async (req, res) => {
    try {
      const { name } = req.query;
      if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Thiếu tham số name" });
      }
      const users = await ClientModel.findUsersByName(name.trim());
      return res.json(users);
    } catch (error) {
      console.error("searchUsers error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  // lấy ra thông tin cá nhân
  getProfile: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("🚀 ~ getProfile: ~ id:", id);
      if (!id) {
        return res.status(401).json({
          errorCode: "NO_REFRESH_TOKEN",
          message: "Bạn chưa đăng nhập"
        });
      }
      const user = await ClientModel.getUserInfo(id);
      const friends = await ClientModel.getAllFriend(id);
      const friendStatus = await ClientModel.getFriendStatus(req.user.id, id);
      const data = {
        user: user,
        friends: friends,
        friendStatus: friendStatus
      };
      return res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin cá nhân:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu lấy thông tin cá nhân."
      });
    }
  },
  // gửi yêu cầu kết bạn
  sendFriendRequest: async (req, res) => {
    try {
      const { id } = req.user;

      const { idFriend } = req.body;
      const addFriend = await ClientModel.addFriendRequest(
        id,
        idFriend,
        "pending",
        func.dateTime()
      );
      await ClientModel.addNotification(
        id,
        "friend_request",
        idFriend,
        null,
        1,
        "Đã gửi lời mời kết bạn",
        func.dateTime()
      );
      const io = getSocketServer();
      const idMen = `${idFriend.toString()}abc`;
      io.emit(idMen, {
        type: "addFriend"
      });
      res.status(200).json(addFriend);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Đã xảy ra lỗi khi yêu cầu gửi yêu cầu kết bạn."
      });
    }
  },
  // Chỉnh sửa thông tin cá nhân
  editProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { username } = req.body;
      // Validation
      if (!username || username.trim().length < 3) {
        return res.status(400).json({ message: "Tên phải có ít nhất 3 ký tự" });
      }
      // Determine avatar filename if uploaded
      const file = req.files;
      const pathImg = file[0]?.path ?? null;
      console.log("🚀 ~ editProfile: ~ pathImg:", pathImg);
      // Update in DB
      await ClientModel.updateUserProfile(userId, username.trim(), pathImg);
      return res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      console.error("editProfile error:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
};

export default clientController;
