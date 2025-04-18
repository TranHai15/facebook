import React from "react";

import { Link } from "react-router-dom";
import { getTimeDifference } from "@utils/function.js";
import { axiosBackend } from "../../../../utils/http";
import { showAlert } from "../../../../utils/function";

export default function Info({ notification, handleClose }) {
  console.log("🚀 ~ Info ~ notification:", notification);
  const {
    id,
    type,
    avatar,
    username,
    content,
    post_id,
    created_at,
    from_user_id,
    is_read
  } = notification;
  const handleAdd = async (id, id_friend) => {
    try {
      const res = await axiosBackend.post("/addFriend", {
        idFriend: id,
        idTable: id_friend
      });
      if (res.status == 200) {
        showAlert("Thêm Bạn thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id_friend) => {
    try {
      const res = await axiosBackend.post("/deleteFriend", {
        idTable: id_friend
      });
      if (res.status == 200) {
        showAlert("Xóa Bạn thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const time = getTimeDifference(created_at);

  const renderDetail = () => {
    const tb = is_read == 1;
    switch (type) {
      case "like":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> vừa thích{" "}
            <Link
              to={`/posts/${post_id}`}
              className="text-black-600 hover:underline"
            >
              bài viết của bạn
            </Link>
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
            {content}”{" "}
            <Link
              to={`/posts/${post_id}#comment-${id}`}
              className="text-black hover:underline"
            >
              Xem chi tiết
            </Link>
            .
            {tb && (
              <span
                className="absolute right-0 top-1/2 w-3 h-3 rounded-full
             bg-cyan-500"
              ></span>
            )}
          </p>
        );
      case "message":
        return (
          <p className={` relative ${tb ? "text-black" : " text-gray-400"}`}>
            <strong className="font-semibold">{username}</strong> đã gửi tin
            nhắn.{" "}
            <Link
              to={`/messages/${from_user_id}`}
              className="text-black hover:underline"
            >
              Đọc tin nhắn
            </Link>
            .
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
              <button
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition min-w-[6rem]"
                onClick={() => {
                  /* accept API */
                  handleAdd(from_user_id, id);
                }}
              >
                Chấp nhận
              </button>
              <button
                className="px-3 py-2 bg-red-300 text-black rounded-lg hover:bg-red-400 transition min-w-[6rem]"
                onClick={() => {
                  /* decline API */
                  handleDelete(id);
                }}
              >
                Từ chối
              </button>
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
    <div className="notification-item flex items-start py-2 bg-white  hover:bg-gray-100 transition-colors ">
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
