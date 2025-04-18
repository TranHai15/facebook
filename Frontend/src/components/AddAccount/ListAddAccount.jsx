import React, { useEffect, useState } from "react";
import AddAccount from "./AddAccount";
import Button from "../UI/Button/Button";
import { axiosBackend } from "@utils/http";
import { showAlert } from "../../utils/function";

export default function ListAddAccount() {
  const [friend, setFriend] = useState([]);
  const getAllFriend = async () => {
    try {
      const res = await axiosBackend.get("/friend");
      setFriend(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFriend();
  }, []);
  const handleAdd = async (event, id, id_friend) => {
    event.stopPropagation();
    try {
      const res = await axiosBackend.post("/addFriend", {
        idFriend: id,
        idTable: id_friend
      });
      if (res.status == 200) {
        showAlert("Thêm Bạn thành công");
        getAllFriend();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (event, id, id_friend) => {
    event.stopPropagation();
    try {
      const res = await axiosBackend.post("/deleteFriend", {
        idTable: id_friend
      });
      if (res.status == 200) {
        showAlert("Xóa Bạn thành công");
        getAllFriend();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleView = async () => {
    alert("Xem chi tiet");
  };

  return (
    <div className=" px-3 py-2 border-t-[1px] border-gray-300 border-b-[1px]">
      {friend.length > 0 && (
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
      )}
      {friend.map((item, index) => (
        <span key={index}>
          <AddAccount
            handleDelete={handleDelete}
            handleView={handleView}
            handleAdd={handleAdd}
            item={item}
          />
        </span>
      ))}
    </div>
  );
}
