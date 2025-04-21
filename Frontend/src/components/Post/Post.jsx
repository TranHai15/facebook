import React, { useContext } from "react";
import { getTimeDifference } from "../../utils/function.js";
import HomeContext from "../../contexts/Client/HomeContenxt.jsx";
export default function Post({ post, type }) {
  console.log("🚀 ~ Post ~ post:", post);
  const pathImg = import.meta.env.VITE_API_BACKEND + "/" + post?.post_image;
  const pathImgAvatar =
    import.meta.env.VITE_API_BACKEND + "/" + post?.user_avatar;
  const date = getTimeDifference(post.post_created_at);
  const { handleGetPostById, handleLike, likeStatus } = useContext(HomeContext);
  const isLiked =
    likeStatus.current[post.post_id] !== undefined
      ? likeStatus.current[post.post_id]
      : post?.is_liked === 1;

  return (
    <div className="bg-white rounded-md shadow my-4">
      {/* Header: Avatar + Tên Page + Thời gian */}
      <div className="flex items-center px-4 pt-4">
        {/* Ảnh đại diện */}
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={
            pathImgAvatar ??
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
        <pre className="w-full overflow-hidden text-wrap">
          {" "}
          {post?.post_content}
        </pre>
      </div>

      {/* Ảnh chính của post */}
      {post.post_image != "null" && (
        <div className="mb-2 w-full border-t-[1px] border-b-[1px] border-gray-200">
          <img
            src={pathImg || post?.post_image}
            alt="Main content"
            className="w-full h-[45rem] rounded-md object-contain"
          />
        </div>
      )}

      {type !== "default" && (
        <>
          {" "}
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
          <hr className="my-2 border-gray-200" />
          {/* Các nút like, comment, share */}
          <div className="flex justify-between text-sm text-gray-700 p-4">
            <button
              className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition"
              onClick={() =>
                handleLike(post.post_id, post?.post_user_id, isLiked)
              }
            >
              {isLiked ? (
                <span>
                  <img
                    className="w-5 object-cover "
                    src="https://cdn.worldvectorlogo.com/logos/facebook-like.svg"
                  />
                </span>
              ) : (
                <span>
                  <img
                    className="w-5 object-cover "
                    src="https://www.svgrepo.com/show/1198/like.svg"
                  />
                </span>
              )}
              <span className="ml-2"> {isLiked && "Đã"} Thích</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition cursor-pointer"
              onClick={() => handleGetPostById(post.post_id)}
            >
              <span>
                <img
                  className="w-5 object-cover "
                  src="https://www.svgrepo.com/show/309459/comment.svg"
                />
              </span>

              <span className="ml-2">Bình luận</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
