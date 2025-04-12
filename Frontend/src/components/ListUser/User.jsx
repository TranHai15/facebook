import React from "react";

export default function User({ handleMessage, item }) {
  return (
    <div
      className="flex gap-3 items-center cursor-pointer my-1 py-2 px-1 hover:bg-gray-200 rounded-[5px]"
      onClick={() => handleMessage(item.id)}
    >
      <div>
        <img
          className="w-8 object-cover rounded-full"
          src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
          alt="Avatar"
        />
      </div>
      <div>
        <p className="text-[14px] font-[500]  text-black">{item.name}</p>
      </div>
    </div>
  );
}
