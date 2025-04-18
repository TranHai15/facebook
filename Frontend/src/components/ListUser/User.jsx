import React from "react";

export default function User({ handleMessage, item }) {
  return (
    <div
      className="flex gap-3 items-center cursor-pointer my-1 py-2 px-1 hover:bg-gray-200 rounded-[5px]"
      onClick={() => handleMessage(item.id, item)}
    >
      <div>
        <img
          className="w-8 flex items-center justify-center object-cover h-8 rounded-full"
          src={item.avatar}
          alt="Avatar"
        />
      </div>
      <div>
        <p className="text-[14px] font-[500]  text-black">{item.username}</p>
      </div>
    </div>
  );
}
