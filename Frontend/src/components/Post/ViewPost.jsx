import React, { useContext } from "react";
import Post from "./Post";
import { useForm } from "react-hook-form";
import { axiosBackend } from "../../utils/http";
import AuthContext from "../../contexts/Auth/AuthContext";
import HomeContext from "../../contexts/Client/HomeContenxt";
export default function ViewPost({ isOpen, onClose, post, comments = [] }) {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { handleGetCommentById } = useContext(HomeContext);
  const handleComment = async (data) => {
    // console.log("🚀 ~ handleComment ~ data:", data);
    const res = await axiosBackend.post("/comment", data);
    console.log("🚀 ~ handleComment ~ res:", res);
    if (res.status == 200) {
      await handleGetCommentById(res.data);
    }
    reset(); // reset form sau khi gửi
  };
  if (!isOpen || !post) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-semibold text-gray-800">
            Bài Viết Của {post?.post_username || "không rõ"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none transition"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>

        {/* Post content */}
        <div className="p-6">
          <Post post={post} />
        </div>

        {/* Bình luận */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Bình luận ({comments.length})
          </h3>

          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((cmt) => (
                <li key={cmt.id} className="flex items-start">
                  <img
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                    src={
                      cmt.user_avatar ||
                      cmt.avatar ||
                      "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
                    }
                    alt={cmt.username || cmt.user_username}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {cmt.username || cmt.user_username}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {cmt.comment || cmt.content}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(cmt.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có bình luận nào.</p>
          )}

          {/* Form bình luận */}
          <form
            onSubmit={handleSubmit(handleComment)}
            className="flex flex-col space-y-3 mt-6"
          >
            <input
              type="hidden"
              value={post.post_id}
              {...register("post_id")}
            />
            <input type="hidden" value={user?.id} {...register("id_send")} />
            <input
              type="hidden"
              value={post?.post_user_id}
              {...register("id_user")}
            />

            <textarea
              {...register("content", {
                required: "Không được để trống bình luận."
              })}
              placeholder="Viết bình luận..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
            <button
              type="submit"
              className="self-end bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Gửi bình luận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
