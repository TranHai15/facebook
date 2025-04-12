import React, { useContext, useState } from "react";
import Button from "../UI/Button/Button";
import User from "./User";
import HomeContext from "../../contexts/Client/HomeContenxt";

export default function ListUser() {
  const { litChat, setListChat } = useContext(HomeContext);
  const handleMessage = (id) => {
    const isExist = litChat.some((item) => item.idChat === id);

    if (!isExist) {
      setListChat((prev) => [{ idChat: id }, ...prev]);
    }
  };

  const [listUser, setListUser] = useState([
    { id: 1, name: "Tran van Hai" },
    { id: 2, name: "Tran van Hai" },
    { id: 3, name: "Tran van Hai" },
    { id: 4, name: "Tran van Hai" },
    { id: 5, name: "Tran van Hai" },
    { id: 6, name: "Tran van Hai" },
    { id: 7, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 8, name: "Tran van Hai" },
    { id: 9, name: "Tran van Hai" }
  ]);

  return (
    <div>
      <div className=" px-3 py-2 ">
        <div className=" flex justify-between items-center py-2">
          <p className="text-[14px] font-bold ">Lời mời kết bạn</p>
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
