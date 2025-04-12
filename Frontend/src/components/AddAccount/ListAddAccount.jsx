import React from "react";
import AddAccount from "./AddAccount";
import Button from "../UI/Button/Button";

export default function ListAddAccount() {
  return (
    <div className=" px-3 py-2 border-t-[1px] border-gray-300 border-b-[1px]">
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
      <AddAccount />
      <AddAccount />
    </div>
  );
}
