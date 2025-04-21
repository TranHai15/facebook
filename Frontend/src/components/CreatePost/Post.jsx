import React, { useContext, useEffect, useRef, useState } from "react";
import { axiosBackend } from "../../utils/http.js";
import { showAlert } from "../../utils/function.js";
import AuthContext from "../../contexts/Auth/AuthContext.jsx";

export default function Post() {
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textRef = useRef();
  const { user } = useContext(AuthContext);
  console.log("🚀 ~ Post ~ user:", user);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Nếu có ảnh cũ thì thu hồi URL cũ
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    textRef.current?.focus();
  }, [showModal]);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile); // 👈 đúng tên phải trùng `image`
      formData.append("content", postContent); // 👈 thêm content cũng đúng
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const res = await axiosBackend.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.status == 200) {
        showAlert("Đăng thành Công");
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPostContent("");
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 font-sans relative">
      {/* Phần trên: Avatar + Input */}
      <div className="flex items-center">
        <div className="w-10 h-10 mr-3">
          <img
            src={
              `${import.meta.env.VITE_API_BACKEND + "/" + user?.avatar}` ||
              "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
            }
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <input
          onClick={() => setShowModal(true)}
          type="text"
          placeholder={`${user?.username || "Loi"} ơi, bạn đang nghĩ gì thế?`}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500 transition"
        />
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Phần dưới: các tuỳ chọn hành động */}
      <div className="flex justify-between">
        <button
          className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition"
          onClick={() => setShowModal(true)}
        >
          <div className="w-7 h-7 mr-3">
            <img
              src="src/assets/icons/img.png"
              alt="Ảnh/video"
              className="w-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-700 font-[600]">Ảnh/video</span>
        </button>
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition">
          <div className="w-7 h-7 mr-3">
            <img
              src="src/assets/icons/icon.png"
              alt="Cảm xúc"
              className="w-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-700 font-[600]">
            Cảm xúc/hoạt động
          </span>
        </button>
      </div>

      {/* Popup Modal + lớp phủ */}
      {showModal && (
        <>
          {/* Overlay màu đục */}
          <div className="fixed inset-0 bg-amber-400 bg-opacity-30 opacity-10 z-[120]"></div>

          {/* Popup */}
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[38rem] h-[30rem] flex justify-center items-center z-[150]">
            <div className="bg-white rounded-lg p-6 w-full h-full shadow-lg border border-gray-300 overflow-y-scroll">
              <h2 className="text-2xl text-center font-bold mb-4">
                Tạo bài viết
              </h2>

              <textarea
                ref={textRef}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì thế?"
                className="w-full h-72 p-2 border border-gray-300 rounded mb-3 resize-none outline-0"
              ></textarea>

              <div className="mb-4">
                <input
                  type="file"
                  id="upload-photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="upload-photo"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16l4-4a2 2 0 012.828 0L15 17m0 0l4-4m-4 4V4"
                    />
                  </svg>
                  Chọn ảnh
                </label>
              </div>

              {/* Xem trước ảnh */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="w-full h-40 object-contain rounded"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePost}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
