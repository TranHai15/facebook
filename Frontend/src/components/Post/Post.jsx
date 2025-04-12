import React from "react";

export default function Post() {
  return (
    <div className="bg-white rounded-md shadow my-4">
      {/* Header: Avatar + Tên Page + Thời gian */}
      <div className="flex items-center px-4 pt-4">
        {/* Ảnh đại diện */}
        <img
          className="w-10 object-cover rounded-full"
          src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
          alt="Avatar"
        />
        {/* Tên page và thời gian */}
        <div className="ml-3 flex flex-col">
          <div className="flex items-center">
            <span className="font-semibold text-sm">Anime - My Heart</span>
            <span className="text-xs ml-2 text-gray-500">• Theo dõi</span>
          </div>
          <span className="text-xs text-gray-500">10 giờ</span>
        </div>
      </div>

      {/* Nội dung text của post */}
      <div className="mb-2 text-sm text-gray-700 px-4 py-2">
        Cặp đôi vừa cute, và trùm cuối Raido và Aharen đã trở lại!
      </div>

      {/* Ảnh chính của post */}
      <div className="mb-2 border-t-[1px] border-b-[1px]">
        <img
          src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/488872361_984280607155600_1572393021155793385_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF8Lb6Zztseq4PRXLCIwhcHYaUbY3EAzeBhpRtjcQDN4CspQ8XqY5Xb7YZJpLSZAalNKEXIXqNZjTV0nbF7oL4t&_nc_ohc=5qoiBidhbrIQ7kNvwEVNm9a&_nc_oc=AdnoIprBFJChKlOF1w30bIYXTspLg1cgBXycIOcWq4qRENVLXHUHxNLu7zPJItbIRAyWKM_bieACU72HhZh6eJ37&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=mJxuBog6aJPnkat3CBeQWw&oh=00_AfHLKVoXMXQo_JsH3fhUzU9aR7b_y5Br6BjkhjDLbAPbiw&oe=67FAF69A"
          alt="Main content"
          className="w-full h-auto rounded-md"
        />
      </div>

      {/* Số lượt like, comment, share */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-4 py-1">
        <div>
          <span className="mr-1">1,7K</span>
          <span>lượt thích</span>
        </div>
        <div>
          <span className="mr-4">61 bình luận</span>
          <span>25 lượt chia sẻ</span>
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
        <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md transition">
          <span>
            <img
              className="w-5 object-cover "
              src="src/assets/icons/chiase.svg"
            />
          </span>
          <span className="ml-2">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
