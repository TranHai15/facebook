import React from "react";
import { getTimeDifference } from "../../utils/function.js";
export default function Post({ post }) {
  const pathImg = import.meta.env.VITE_API_BACKEND + "/" + post?.post_image;
  const date = getTimeDifference(post.post_created_at);
  return (
    <div className="bg-white rounded-md shadow my-4">
      {/* Header: Avatar + Tên Page + Thời gian */}
      <div className="flex items-center px-4 pt-4">
        {/* Ảnh đại diện */}
        <img
          className="w-10 object-cover rounded-full"
          src={
            post?.user_avatar ??
            "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
          }
          alt="Avatar"
        />
        {/* Tên page và thời gian */}
        <div className="ml-3 flex flex-col">
          <div className="flex items-center">
            <span className="font-semibold text-sm">{post?.post_username}</span>
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>

      {/* Nội dung text của post */}
      <div className="mb-2 text-sm text-gray-700 px-4 py-2">
        {post?.post_content}
      </div>

      {/* Ảnh chính của post */}
      {post.post_image != "null" && (
        <div className="mb-2 w-full border-t-[1px] border-b-[1px] border-gray-200">
          <img
            src={pathImg}
            alt="Main content"
            className="w-full h-[45rem] rounded-md object-cover"
          />
        </div>
      )}

      {/* Số lượt like, comment, share */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-4 py-1">
        <div>
          <span className="mr-1">{post?.like_count}</span>
          <span>lượt thích</span>
        </div>
        <div>
          <span className="mr-1">{post?.comment_count}</span>
          <span>bình luận</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-2 border-gray-200" />

      {/* Các nút like, comment, share */}
      <div className="flex justify-between text-sm text-gray-700 p-4">
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition">
          <span>
            <img
              className="w-5 object-cover "
              src="src/assets/icons/like.svg"
            />
          </span>
          <span className="ml-2"> Thích</span>
        </button>
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition">
          <span>
            <img
              className="w-5 object-cover "
              src="src/assets/icons/comment.svg"
            />
          </span>
          <span className="ml-2">Bình luận</span>
        </button>
      </div>
    </div>
  );
}
