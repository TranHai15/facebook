import React from "react";

export default function Post() {
  return (
    <div className=" bg-white rounded-lg shadow p-4 font-sans">
      {/* Phần trên: Avatar + Input */}
      <div className="flex items-center">
        <div className="w-10 h-10 mr-3">
          <img
            src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <input
          type="text"
          placeholder="Hải ơi, bạn đang nghĩ gì thế?"
          className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500 transition"
        />
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Phần dưới: các tuỳ chọn hành động */}
      <div className="flex justify-between">
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition">
          {/* Icon mẫu (bạn có thể thay thế bằng icon của thư viện như Font Awesome) */}
          <div className="w-7 h-7 mr-3">
            <img
              src="src/assets/icons/video.png"
              alt="Avatar"
              className="w-full object-cover "
            />
          </div>
          <span className="text-sm text-gray-700 font-[600]">
            Video trực tiếp
          </span>
        </button>
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition">
          <div className="w-7 h-7 mr-3">
            <img
              src="src/assets/icons/img.png"
              alt="Avatar"
              className="w-full object-cover "
            />
          </div>
          <span className="text-sm text-gray-700 font-[600]">Ảnh/video</span>
        </button>
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition">
          <div className="w-7 h-7 mr-3">
            <img
              src="src/assets/icons/icon.png"
              alt="Avatar"
              className="w-full object-cover "
            />
          </div>
          <span className="text-sm text-gray-700 font-[600]">
            Cảm xúc/hoạt động
          </span>
        </button>
      </div>
    </div>
  );
}
