import React, { useContext, useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import User from "./User";
import HomeContext from "@contexts/Client/HomeContenxt";
import { axiosBackend } from "@utils/http.js";

export default function ListUser() {
  const { litChat, setListChat, setMessageChat } = useContext(HomeContext);
  const handleMessage = async (id, users) => {
    const isExist = litChat.some((item) => item.idChat === id);
    const kq = await getRoomByChat(users);
    let idRoom = kq?.idChat;
    let message = kq?.chatMessage;
    if (!isExist) {
      setListChat((prev) => [{ idChat: idRoom, user: users }, ...prev]);
      setMessageChat((pre) => ({
        ...pre,
        [idRoom]: message
      }));
    }
  };
  const getRoomByChat = async (user) => {
    try {
      const res = await axiosBackend.post("/chat", {
        sender_id: user?.id,
        type: user?.type
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const [listUser, setListUser] = useState([]);
  const getUser = async () => {
    try {
      const res = await axiosBackend.get("/user");
      setListUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      <div className=" px-3 py-2 ">
        <div className=" flex justify-between items-center py-2">
          <p className="text-[14px] font-bold ">Danh sách bạn bè</p>
          <Button
            className={
              "bg-transparent hover:bg-gray-300 px-4 py-2 rounded-2xl cursor-pointer"
            }
          >
            <p className="text-[13px] font-bold  text-blue-400 cursor-pointer">
              Xem tất cả
            </p>
          </Button>
        </div>
        {listUser.map((item, index) => (
          <span key={index}>
            <User handleMessage={handleMessage} item={item} />
          </span>
        ))}
      </div>
    </div>
  );
}
