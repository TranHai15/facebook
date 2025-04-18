import React from "react";
import Button from "../UI/Button/Button";

export default function AddAccount({
  item,
  handleAdd,
  handleView,
  handleDelete
}) {
  return (
    <div
      className="flex gap-1 w-full items-center hover:bg-gray-200 cursor-pointer my-2 p-1"
      onClick={handleView}
    >
      {/* avatar */}
      <div className="w-14 min-w-[60px]">
        <img
          className="w-14 object-cover rounded-full"
          src={
            item?.avatar ??
            "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
          }
          alt="Avatar"
        />
      </div>
      {/* content */}
      <div className="p-1 ">
        <div className="flex justify-between items-end p-1 ">
          <p className="text-[14px] text-black font-[500]">{item.username}</p>
          <span className="text-[10px] text-gray-600 font-bold">2 tuần</span>
        </div>
        <div className="flex items-center gap-3 p-1 pt-1">
          <Button
            type={"submit"}
            onClick={(e) => handleAdd(e, item.id, item.id_friend)}
            className={
              "px-6 min-w-[7rem] py-2 bg-blue-500 text-[11px] text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2  cursor-pointer focus:ring-blue-300"
            }
          >
            <p className="text-[14px] text-white font-[600]">Xác Nhận</p>
          </Button>
          <Button
            type={"submit"}
            onClick={(e) => handleDelete(e, item.id, item.id_friend)}
            className={
              "px-6 py-2  min-w-[7rem] bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            }
          >
            <p className="text-[14px] text-black font-[600]">Xóa</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
