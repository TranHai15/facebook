import db from "../db.js";

class ClientModel {
  // Lấy tất cả bạn bè
  static async getAllFriend(id) {
    try {
      const query = `SELECT 
    CASE 
        WHEN f.user1_id = ? THEN f.user2_id 
        ELSE f.user1_id 
    END AS id,
        u.username,
        u.avatar,
        'private' AS type
    FROM friends f
    JOIN users u 
    ON u.id = CASE 
               WHEN f.user1_id = ? THEN f.user2_id 
               ELSE f.user1_id 
     END
              WHERE f.user1_id = ? OR f.user2_id = ?
            
    UNION
    SELECT 
        c.id AS id,
        c.name AS username,
        NULL AS avatar,
        'group' AS type
    FROM conversations c
    JOIN conversation_participants cp 
    ON cp.conversation_id = c.id
             WHERE cp.user_id = ? AND c.is_group = 1`;
      const [stmt] = await db.execute(query, [id, id, id, id, id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // lấy id trò chuyện
  static async getIDMessage(user1_id, user2_id, type) {
    try {
      let query = "";
      let params = [];

      if (type === "private") {
        query = `
      SELECT c.id AS conversation_id
      FROM conversations c
      JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
      JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = ?
      WHERE c.is_group = 0
    `;
        params = [user1_id, user2_id];
      } else if (type === "group") {
        query = `
      SELECT c.id AS conversation_id
      FROM conversations c
      JOIN conversation_participants cp ON cp.conversation_id = c.id
      WHERE c.is_group = 1 AND c.id = ? AND cp.user_id = ?
    `;
        params = [user2_id, user1_id]; // user2_id là group id
      } else {
        return null;
      }

      const [rows] = await db.execute(query, params);
      return rows.length ? rows[0].conversation_id : null;
    } catch (error) {
      throw error;
    }
  }
  // Tạo Chat mới
  static async createMessage(user1_id, user2_id, time) {
    console.log("🚀 ~ ClientModel ~ createMessage ~ user2_id:", user2_id);
    console.log("🚀 ~ ClientModel ~ createMessage ~ user1_id:", user1_id);
    try {
      const createRoom = `INSERT INTO conversations (name, is_group,created_at)
      VALUES (?, ?, ?)
      `;
      const value = await db.execute(createRoom, ["chat", 0, time]);

      const lastID = value[0]?.insertId;
      // them vao conversation_participants
      await ClientModel.InsertConversation_participants(lastID, user1_id, time);
      await ClientModel.InsertConversation_participants(lastID, user2_id, time);
      return lastID;
    } catch (error) {
      throw error;
    }
  }
  // thêm chat mới chi tiết
  static async InsertConversation_participants(conversation_id, id, time) {
    try {
      const insertRoom = `INSERT INTO conversation_participants (conversation_id, user_id,joined_at)
      VALUES (?, ?, ?)
      `;
      const values = await db.execute(insertRoom, [conversation_id, id, time]);
      return values;
    } catch (error) {
      throw error;
    }
  }
  // lây lịch sử trò chuyện
  static async getAllMessage(idRoom) {
    try {
      const query = `SELECT 
    m.id AS message_id,
    m.conversation_id,
    m.sender_id,
    u.username AS sender_username,
    u.avatar AS sender_avatar,
    m.content,
    m.created_at
FROM messages m
JOIN users u ON u.id = m.sender_id
WHERE m.conversation_id = ?
ORDER BY m.created_at ASC;
`;

      const [stmt] = await db.execute(query, [idRoom]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Thêm message vào message
  static async insertMessage(conversation_id, id_send, content, time) {
    try {
      const insertRoom = `INSERT INTO messages (conversation_id, sender_id,content,created_at)
      VALUES (?, ?, ?,?)
      `;
      const values = await db.execute(insertRoom, [
        conversation_id,
        id_send,
        content,
        time
      ]);
      return values;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách người dùng dựa theo phòng
  static async getAllUserByRoomId(conversation_id) {
    try {
      const query = `select u.id ,u.username , u.avatar from users as u join conversation_participants as c on c.user_id = u.id where c.conversation_id = ?`;
      const [stmt] = await db.execute(query, [conversation_id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Lấy toàn bộ lời mời kết bạn
  static async getAllFriendReq(id) {
    try {
      const query = `SELECT 
  f.id AS id_friend,  
  u.username, 
  u.id, 
  u.avatar, 
  f.sender_id AS nguoiGui 
FROM friend_requests AS f 
JOIN users AS u ON u.id = f.sender_id 
WHERE f.receiver_id = ? AND f.status = "pending" 
ORDER BY f.created_at DESC 
LIMIT 4
`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      console.log(error);
    }
  }
  // Chấp nhận kết bạn
  static async addFriend(id_send, id_end, time) {
    try {
      const query = `insert into friends (user1_id,user2_id,created_at) values (?,?,?)`;
      const stmt = db.execute(query, [id_send, id_end, time]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // xóa đi lời mời khi ko chấp nhận
  static async deleteFriend(idTable) {
    try {
      const query = `delete from friend_requests where id = ?`;
      const stmt = await db.execute(query, [idTable]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // xóa thông báo dựa theo type và id người gửi id người nhận
  static async deleteFriendRequestNotification(
    user_id,
    from_user_id,
    type = "friend_request"
  ) {
    try {
      const query = `
      DELETE FROM notifications 
      WHERE type = ? AND user_id = ? AND from_user_id = ?
    `;
      const stmt = await db.execute(query, [type, user_id, from_user_id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }

  // chueyern đổi trạng thái khi kết bạn thành công
  static async acceptedFriend(idTable) {
    try {
      const query = `UPDATE friend_requests SET status = "accepted" WHERE id = ?;
`;
      const stmt = await db.execute(query, [idTable]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Lấy danh sách bài post
  static async getAllPost(id) {
    try {
      const query = `SELECT 
    p.id AS post_id,
    p.user_id AS post_user_id,
    u.username AS post_username,
    u.avatar as user_avatar,
    p.content AS post_content,
    p.image AS post_image,
    p.created_at AS post_created_at,

    COUNT(DISTINCT r.id) AS like_count,
    COUNT(DISTINCT c.id) AS comment_count,

 CASE 
    WHEN MAX(rl.id) IS NOT NULL THEN 1 
    ELSE 0 
END AS is_liked

FROM posts p
JOIN users u ON p.user_id = u.id

LEFT JOIN reactions r ON r.post_id = p.id

LEFT JOIN comments c ON c.post_id = p.id
LEFT JOIN reactions rl ON rl.post_id = p.id AND rl.user_id = ?
WHERE p.user_id = ?  
   OR p.user_id IN (
        SELECT 
            CASE 
                WHEN f.user1_id = ? THEN f.user2_id 
                ELSE f.user1_id 
            END
        FROM friends f
        WHERE f.user1_id = ? OR f.user2_id = ?
   )

GROUP BY p.id
ORDER BY p.created_at DESC


`;
      const [stmt] = await db.execute(query, [id, id, id, id, id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Thêm Post
  static async addPost(user_id, content, image, time) {
    try {
      const query = `insert into posts (user_id,content,image,created_at) values (?,?,?,?)`;
      const stmt = await db.execute(query, [user_id, content, image, time]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Lấy toàn bộ thông báo
  static async getAllNotification(id) {
    try {
      const query = `SELECT n.*,u.avatar,u.username from notifications AS n JOIN users AS u ON u.id = n.user_id  where n.from_user_id = ? ORDER BY created_at desc`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Lấy toàn bộ danh sách phòng chat
  static async getAllMessageChat(id) {
    try {
      const query = `SELECT 
  c.id AS conversation_id,c.is_group AS typeGroup,
  IF(c.is_group = 1, c.name, u2.username) AS title,
  IF(c.is_group = 1, NULL, u2.avatar) AS avatar,
  m.content AS last_message,
  m.created_at
FROM conversations c
JOIN conversation_participants cp ON cp.conversation_id = c.id
JOIN (
    SELECT conversation_id, MAX(created_at) AS max_time
    FROM messages
    GROUP BY conversation_id
) latest_msg ON latest_msg.conversation_id = c.id
JOIN messages m ON m.conversation_id = latest_msg.conversation_id AND m.created_at = latest_msg.max_time
LEFT JOIN (
    SELECT u.id, u.username, u.avatar, cp2.conversation_id
    FROM users u
    JOIN conversation_participants cp2 ON cp2.user_id = u.id
) u2 ON u2.conversation_id = c.id AND c.is_group = 0 AND u2.id != ?
WHERE cp.user_id = ?
ORDER BY m.created_at DESC;
`;
      const [stmt] = await db.execute(query, [id, id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Lấy tất cả thông báo chưa đọc lúc mới đăng nhập
  static async getAllNotificationUnread(id) {
    try {
      const query = `SELECT n.user_id,n.type from notifications AS n where n.from_user_id = ? and is_read = 1`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // thêm thông báo mới
  static async addNotification(
    user_id,
    type,
    from_user_id,
    post_id,
    is_read,
    content,
    created_at
  ) {
    try {
      const query = `insert into notifications (user_id,type,from_user_id,post_id,is_read,content,created_at) values (?,?,?,?,?,?,?)`;
      const stmt = await db.execute(query, [
        user_id,
        type,
        from_user_id,
        post_id,
        is_read,
        content,
        created_at
      ]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // đanh dấu đã đọc thông báo tin nhắn
  static async markNotificationAsRead(idRoom, userId) {
    try {
      const query = `UPDATE notifications AS n
JOIN conversation_participants AS cp
  ON n.user_id = cp.user_id
JOIN conversations AS c
  ON cp.conversation_id = c.id
SET n.is_read = 0
WHERE c.id = ? AND n.from_user_id =?
  AND n.type = 'message';
`;
      const stmt = await db.execute(query, [idRoom, userId]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // đánh dấu đã đọc thông báo
  static async markNotificationAsReadNof(id) {
    try {
      const query = `UPDATE notifications SET is_read = 0 WHERE id = ?`;
      const stmt = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // lấy chi tiết bài viết
  static async getPostById(id) {
    try {
      const query = `SELECT 
   p.id AS post_id,
    p.user_id AS post_user_id,
    u.username AS post_username,
    u.avatar as user_avatar,
    p.content AS post_content,
    p.image AS post_image,
    p.created_at AS post_created_at,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id) AS like_count,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
FROM posts AS p
JOIN users AS u ON u.id = p.user_id
WHERE p.id = ?
`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // lấy ra danh sách comment dựa theo id bài post
  static async getCommentByPostId(id) {
    try {
      const query = `SELECT 
  c.*, 
  u.username, 
  u.avatar
FROM comments AS c
JOIN users AS u ON u.id = c.user_id
WHERE c.post_id = ?
ORDER BY c.created_at desc
`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // lấy ra số người like bài viết
  static async getLikeByPostId(id) {
    try {
      const query = `SELECT 
  u.username
FROM reactions AS r
JOIN users AS u ON u.id = r.user_id
WHERE r.post_id = ?
`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // thêm comment
  static async addComment(post_id, user_id, content, time) {
    try {
      const query = `insert into comments (post_id,user_id,comment,created_at) values (?,?,?,?)`;
      const stmt = await db.execute(query, [post_id, user_id, content, time]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // them like
  static async addLike(post_id, user_id, time, type) {
    try {
      if (type) {
        // xóa like
        console.log("xóa like");
        const query = `delete from reactions where post_id = ? and user_id = ?`;
        const stmt = await db.execute(query, [post_id, user_id]);
        return stmt;
      } else {
        console.log("thêm like");
        const query = `insert into reactions (post_id,user_id ,created_at) values (?,?,?)`;
        const stmt = await db.execute(query, [post_id, user_id, time]);
        return stmt;
      }
    } catch (error) {
      throw error;
    }
  }
  // tìm kiếm theo tên
  static async findUsersByName(name) {
    const sql = `
    SELECT id, username, avatar
    FROM users
    WHERE username LIKE ?
    ORDER BY username ASC
    LIMIT 20
  `;
    const params = [`%${name}%`];
    const [rows] = await db.execute(sql, params);
    return rows;
  }
  // lấy ra thông tin người dùng
  static async getUserInfo(id) {
    try {
      const query = `SELECT id, username, avatar FROM users WHERE id = ?`;
      const [stmt] = await db.execute(query, [id]);
      return stmt[0];
    } catch (error) {
      throw error;
    }
  }
  // lấy ra trạng thái kết bạn
  static async getFriendStatus(user1_id, user2_id) {
    try {
      const query = ` SELECT status, sender_id, receiver_id ,id
    FROM friend_requests
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    LIMIT 1`;
      const [stmt] = await db.execute(query, [
        user1_id,
        user2_id,
        user2_id,
        user1_id
      ]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // thêm yêu cầu kết bạn
  static async addFriendRequest(sender_id, receiver_id, status, time) {
    try {
      const query = `INSERT INTO friend_requests (sender_id, receiver_id, status, created_at) VALUES (?, ?, ?, ?)`;
      const stmt = await db.execute(query, [
        sender_id,
        receiver_id,
        status,
        time
      ]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // chỉnh sửa thông tin user
  static async updateUserProfile(userId, username, avatar) {
    console.log("🚀 ~ ClientModel ~ updateUserProfile ~ avatar:", avatar);
    try {
      if (avatar) {
        const sql = `UPDATE users SET username = ?, avatar = ? WHERE id = ?`;
        await db.execute(sql, [username, avatar, userId]);
      } else {
        const sql = `UPDATE users SET username = ? WHERE id = ?`;
        await db.execute(sql, [username, userId]);
      }
    } catch (error) {
      throw error;
    }
  }
}
export default ClientModel;
