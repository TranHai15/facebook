import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { getTimeDifference } from "@utils/function.js";
import { axiosBackend } from "../../../../utils/http";
import { showAlert } from "../../../../utils/function";
import HomeContext from "../../../../contexts/Client/HomeContenxt";

export default function Info({ notification, handleView }) {
  const {
    id,
    type,
    avatar,
    username,
    content,
    post_id,
    created_at,

    user_id,
    is_read
  } = notification;
  const { handleGetPostById } = useContext(HomeContext);

  const handleAdd = async (id) => {
    window.location.href = `/profile/${id}`;
  };

  const time = getTimeDifference(created_at);

  const renderDetail = () => {
    const tb = is_read == 1;
    switch (type) {
      case "like":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> vừa thích bài
            viết của bạn
            <span
              className="ml-1 cursor-pointer"
              onClick={() => handleGetPostById(post_id)}
            >
              Xem
            </span>
            .
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </p>
        );
      case "comment":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> bình luận: “
            {content}
            <span
              className="ml-1 cursor-pointer"
              onClick={() => handleGetPostById(post_id)}
            >
              Xem chi tiết
            </span>
            .
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </p>
        );
      case "post":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> Đã đăng 1 Bài.{" "}
            <span onClick={() => handleGetPostById(post_id)}>Xem bài</span>.
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </p>
        );
      case "friend_request":
        return (
          <div className="flex-col items-center gap-4 relative">
            <div>
              <p
                className={` relative ${tb ? "text-black" : " text-gray-400"}`}
              >
                <strong className="font-semibold">{username}</strong> đã gửi lời
                mời kết bạn.
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pr-4">
              <p
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition min-w-[6rem] cursor-pointer"
                onClick={() => {
                  /* accept API */
                  handleAdd(user_id);
                }}
              >
                Xem chi tiết
              </p>
            </div>
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </div>
        );
      case "friend_accept":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> đã chấp nhận
            lời mời kết bạn của bạn.
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </p>
        );
      default:
        return <p className="text-black">Loại thông báo không xác định.</p>;
    }
  };

  return (
    <div
      className="notification-item flex items-start py-2 bg-white  hover:bg-gray-100 transition-colors "
      onClick={() => handleView(id)}
    >
      <img
        src={avatar}
        alt={username}
        className="w-14 h-14 rounded-full mr-5"
      />
      <div className="flex-1 space-y-1">
        {renderDetail()}
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
}
