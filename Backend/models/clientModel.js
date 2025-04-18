import db from "../db.js";

class ClientModel {
  // Lấy tất cả bạn bè
  static async getAllFriend(id) {
    try {
      const query = `SELECT 
    CASE 
        WHEN f.user1_id = 9 THEN f.user2_id 
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
      const [stmt] = await db.execute(query, [id, id, id, id]);
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
      const query = `select f.id AS id_friend,  u.username, u.id, u.avatar, f.sender_id AS nguoiGui from friend_requests as f join users as u on u.id = f.sender_id where f.receiver_id = ? order by f.created_at desc limit 2`;
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
  // xóa đi lời mời khi kết bạn thành công
  static async deleteFriend(idTable) {
    try {
      const query = `delete from friend_requests where id = ?`;
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
    COUNT(DISTINCT c.id) AS comment_count

FROM posts p
JOIN users u ON p.user_id = u.id

-- JOIN reactions và comments
LEFT JOIN reactions r ON r.post_id = p.id
LEFT JOIN comments c ON c.post_id = p.id

-- WHERE sau JOIN
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
      const [stmt] = await db.execute(query, [id, id, id, id]);
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
      const query = `SELECT n.*,u.avatar,u.username from notifications AS n JOIN users AS u ON u.id = n.from_user_id  where user_id = 9 ORDER BY created_at desc`;
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
}
export default ClientModel;
