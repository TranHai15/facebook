import React from "react";
import { Link } from "react-router-dom";
import { getTimeDifference } from "@utils/function.js";

export default function Message({ messages, handleMessage }) {
  const { conversation_id, avatar, created_at, title, last_message } = messages;

  const time = getTimeDifference(created_at);
  return (
    <div
      className="notification-item flex items-start py-3 bg-white  hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() =>
        handleMessage(conversation_id, {
          avatar: avatar ?? null,
          username: title
        })
      }
    >
      <img src={avatar} alt={title} className="w-14 h-14 rounded-full mr-5" />
      <div>
        <div className="flex-col">
          <p className="text-black font-bold">{title}</p>
        </div>
        <div className="flex mt-2 items-end">
          <p className="text-black truncate">{last_message}</p>
          <div className="text-[12px] text-gray-500 ml-2 min-w-fit">{time}</div>
        </div>
      </div>
    </div>
  );
}
