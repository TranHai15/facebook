import db, { DB_FIELDS, DB_TABLES } from "../db.js";
const TABLE_USER = DB_TABLES.USERS;
const TABLE_JWT = DB_TABLES.JWT;
const USER = DB_FIELDS.USERS;
const JWT = DB_FIELDS.JWT;
class AuthModel {
  //  kiểm tra xem đã tồn tại email chưa
  static async isEmail(email, status = false) {
    try {
      let query;
      if (status) {
        query = `SELECT *  from ${TABLE_USER} Where ${USER.EMAIL} = ?`;
      } else {
        query = `SELECT count("*") as so_luong from ${TABLE_USER} Where ${USER.EMAIL} = ?`;
      }
      const [stmt] = await db.execute(query, [email]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // đăng ký
  static async register(name, email, password, avatar, is_admin, created_at) {
    try {
      const query = `INSERT INTO ${TABLE_USER}
       (${USER.USERNAME},${USER.EMAIL},${USER.PASSWORD},${USER.AVATAR},${USER.IS_ADMIN},${USER.CREATED_AT}) 
       VALUES (?,?,?,?,?,?)`;
      const [stmt] = await db.execute(query, [
        name,
        email,
        password,
        avatar,
        is_admin,
        created_at
      ]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Xóa hêt phiên đăng nhập cũ của user
  static async deleteSessionById(id) {
    try {
      const query = `DELETE FROM ${TABLE_JWT}
       WHERE ${JWT.ID} = ?`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Thêm phiên đăng nhập mới cho user
  static async insertSessionById(id, refreshToken, created_at) {
    try {
      const query = `INSERT INTO ${TABLE_JWT}
       (${JWT.ID},${JWT.REFRESH_TOKEN},${JWT.CREATED_AT}) 
       VALUES (?,?,?)`;
      const [stmt] = await db.execute(query, [id, refreshToken, created_at]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // đăng xuất
  static async logout(id) {
    try {
      const query = `DELETE FROM ${TABLE_JWT} WHERE ${JWT.ID} = ?`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
  // Kiểm tra token xem có giống trong db không
  static async checkSession(id) {
    try {
      let query = `SELECT refresh_token from ${TABLE_JWT} Where ${JWT.ID} = ?`;
      const [stmt] = await db.execute(query, [id]);
      return stmt;
    } catch (error) {
      throw error;
    }
  }
}
export default AuthModel;
