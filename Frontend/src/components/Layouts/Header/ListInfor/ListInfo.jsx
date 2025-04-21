// ListInfo.jsx
import React, { useContext, useRef } from "react";

import Info from "./Infor";
import "./style.scss";
import HomeContext from "../../../../contexts/Client/HomeContenxt";
import AuthContext from "../../../../contexts/Auth/AuthContext";
export default function ListInfo() {
  const { fetchNotifications, notifications, setNotifications } =
    useContext(HomeContext);
  console.log("🚀 ~ ListInfo ~ notifications:", notifications);
  const { socket, user } = useContext(AuthContext);

  const check = useRef(false);
  const handleView = (id) => {
    // setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!socket) return;
    socket.emit("readNotification", { id: id, user_id: user?.id });
  };
  const handelFilter = (type) => {
    if (type === true) {
      check.current = true;
      setNotifications((prev) => prev.filter((n) => n.is_read !== 0));
    }
    if (type === false) {
      check.current = false;
      fetchNotifications();
    }
  };

  return (
    <div className="w-full h-full p-4 ">
      <h3 className="text-2xl font-bold mb-4 text-black">Thông báo</h3>
      <div className="flex gap-2 mb-4">
        <span
          className={`font-bold px-3 py-2 cursor-pointer rounded-2xl text-black ${
            check.current ? "hover:bg-gray-200" : " bg-cyan-200"
          }`}
          onClick={() => handelFilter(false)}
        >
          Tất cả
        </span>
        <span
          className={`font-bold px-3 py-2 cursor-pointer rounded-2xl text-black ${
            !check.current ? "hover:bg-gray-200" : " bg-cyan-200"
          }`}
          onClick={() => handelFilter(true)}
        >
          Chưa đọc
        </span>
      </div>
      <div className="overflow-y-auto max-h-[70vh] scrollbar">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 ">Không có thông báo nào</p>
        ) : (
          notifications.map((notification) => (
            <Info
              key={notification.id}
              notification={notification}
              handleView={handleView}
            />
          ))
        )}
      </div>
    </div>
  );
}
