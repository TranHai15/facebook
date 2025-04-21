import React from "react";

export default function Search({ item, onSelect }) {
  return (
    <div
      className="w-full h-full my-1 hover:bg-gray-300"
      onClick={() => onSelect(item.id)}
    >
      <div className="p-3 flex gap-1 items-center justify-between">
        <div className="Image__Search flex-[1]">
          <img
            className="w-10 rounded-4xl object-cover"
            src={item.avatar || "/default-avatar.png"}
            alt={item.username}
          />
        </div>
        <div className="Title flex-[4] text-black">
          <p>{item.username}</p>
        </div>
      </div>
    </div>
  );
}
