import React, { useEffect, useState } from "react";
import Post from "./Post";
import { axiosBackend } from "../../utils/http";

export default function ListPost() {
  const [post, setPost] = useState([]);
  console.log("🚀 ~ ListPost ~ post:", post);
  const postDefauld = [
    {
      comment_count: 0,
      is_liked: 0,
      like_count: 0,
      post_content: `Chúng tôi rất vui khi bạn gia nhập cộng đồng. Dưới đây là một số hướng dẫn để bạn bắt đầu:
Thông báo (Notification)
‑ Nhấp vào biểu tượng chuông 🔔 để xem tất cả thông báo: lượt thích, bình luận, lời mời kết bạn,… Luôn được cập nhật ngay khi có hoạt động mới.
Tin nhắn (Messenger)
‑ Sử dụng biểu tượng trò chuyện 💬 để trò chuyện riêng tư trong thời gian thực với bạn bè.
Chỉnh sửa hồ sơ (Profile)
‑ Truy cập trang cá nhân của bạn, nhấn “Sửa thông tin” để thay đổi tên hoặc ảnh đại diện. Cá nhân hóa hồ sơ theo phong cách riêng.
Bài viết (Posts)
‑ Tạo bài viết mới bằng cách viết nội dung và đăng kèm hình ảnh. Theo dõi lượt tương tác của bạn qua số like và bình luận.
Kết bạn (Friends)
‑ Gửi và quản lý lời mời kết bạn. Sau khi chấp nhận, bạn sẽ có thể nhắn tin và xem bài viết riêng tư của nhau.
🌟 Hãy khám phá thêm và kết nối với bạn bè của bạn ngay hôm nay!`,
      post_created_at: "2025-04-21T07:06:25.000Z",
      post_id: 112,
      post_image:
        "uploads/public/1745220300889-3c91efd3-175f-425b-b024-60f9239dcad3.png",
      post_user_id: 9,
      post_username: "Facebook",
      user_avatar:
        "uploads\\public\\1745220700555-Facebook_Logo_(2019).png.webp"
    }
  ];
  const getAllPost = async () => {
    try {
      const res = await axiosBackend.get("/post");
      setPost(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPost();
  }, []);
  return (
    <div>
      {post.length == 0
        ? postDefauld.map((post, index) => (
            <span key={index}>
              <Post post={post} type={"default"} />
            </span>
          ))
        : post.map((post, index) => (
            <span key={index}>
              <Post post={post} />
            </span>
          ))}
    </div>
  );
}
