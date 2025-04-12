// file kết nối vs db
import mysql from "mysql2/promise.js";
import dotenv from "dotenv";
dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;

// dbSchema.js

export const DB_TABLES = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
  REACTIONS: "reactions",
  CONVERSATIONS: "conversations",
  CONVERSATION_PARTICIPANTS: "conversation_participants",
  MESSAGES: "messages",
  FRIEND_REQUESTS: "friend_requests",
  FRIENDS: "friends",
  JWT: "jwt",
  NOTIFICATIONS: "notifications"
};

export const DB_FIELDS = {
  USERS: {
    ID: "id",
    USERNAME: "username",
    EMAIL: "email",
    PASSWORD: "password",
    AVATAR: "avatar",
    IS_ADMIN: "is_admin",
    CREATED_AT: "created_at"
  },
  POSTS: {
    ID: "id",
    USER_ID: "user_id",
    CONTENT: "content",
    IMAGE: "image",
    CREATED_AT: "created_at"
  },
  COMMENTS: {
    ID: "id",
    POST_ID: "post_id",
    USER_ID: "user_id",
    COMMENT: "comment",
    CREATED_AT: "created_at"
  },
  REACTIONS: {
    ID: "id",
    POST_ID: "post_id",
    USER_ID: "user_id",
    CREATED_AT: "created_at"
  },
  CONVERSATIONS: {
    ID: "id",
    NAME: "name",
    IS_GROUP: "is_group",
    CREATED_AT: "created_at"
  },
  CONVERSATION_PARTICIPANTS: {
    ID: "id",
    CONVERSATION_ID: "conversation_id",
    USER_ID: "user_id",
    JOINED_AT: "joined_at"
  },
  MESSAGES: {
    ID: "id",
    CONVERSATION_ID: "conversation_id",
    SENDER_ID: "sender_id",
    CONTENT: "content",
    CREATED_AT: "created_at"
  },
  FRIEND_REQUESTS: {
    ID: "id",
    SENDER_ID: "sender_id",
    RECEIVER_ID: "receiver_id",
    STATUS: "status",
    CREATED_AT: "created_at"
  },
  FRIENDS: {
    ID: "id",
    USER1_ID: "user1_id",
    USER2_ID: "user2_id",
    CREATED_AT: "created_at"
  },
  NOTIFICATIONS: {
    ID: "id",
    USER_ID: "user_id",
    TYPE: "type",
    FROM_USER_ID: "from_user_id",
    POST_ID: "post_id",
    IS_READ: "is_read",
    CONTENT: "content",
    CREATED_AT: "created_at"
  },
  JWT: {
    SESSION_ID: "session_id",
    ID: "id",
    REFRESH_TOKEN: "refresh_token",
    CREATED_AT: "created_at"
  }
};
