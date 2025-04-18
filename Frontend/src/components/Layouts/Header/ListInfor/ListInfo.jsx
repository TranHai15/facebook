// ListInfo.jsx
import React, { useEffect, useRef, useState } from "react";
import { axiosBackend } from "@utils/http.js";
import Info from "./Infor";
import "./style.scss";
export default function ListInfo() {
  const [notifications, setNotifications] = useState([]);
  const check = useRef(false);
  const fetchNotifications = async () => {
    try {
      const res = await axiosBackend.get("/notification");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
              handleClose={handleClose}
            />
          ))
        )}
      </div>
    </div>
  );
}
