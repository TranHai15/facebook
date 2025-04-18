import React, { useContext, useEffect, useRef, useState } from "react";
import MessengerMock from "./Message";
import HomeContext from "../../contexts/Client/HomeContenxt";
import AuthContext from "../../contexts/Auth/AuthContext";
import { getSocket } from "@utils/socket";

export default function ListMessage() {
  const socket = getSocket();
  const { litChat, setListChat, messages, setMessageChat } =
    useContext(HomeContext);
  const { user } = useContext(AuthContext);
  const [chatInputs, setChatInputs] = useState({});

  const inputRefs = useRef({});
  const contentChat = useRef({});

  const handleClose = (id) => {
    setListChat(litChat.filter((item) => item.idChat !== id));
    setMessageChat((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    delete contentChat.current[id];
  };

  const handleChat = (e, idChat) => {
    setChatInputs((prev) => ({
      ...prev,
      [idChat]: e.target.value
    }));
  };

  const handleSubmit = (idRoom) => {
    const content = chatInputs[idRoom];
    if (content.trim() !== "") {
      const newMessage = {
        content: content,
        conversation_id: idRoom,
        sender_username: user?.username,
        sender_avatar:
          user?.avatar ||
          "https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-mac-dinh-12-1724862391.jpg",
        sender_id: user?.id
      };

      setMessageChat((prev) => ({
        ...prev,
        [idRoom]: [...(prev[idRoom] || []), newMessage]
      }));

      // Reset input after sending
      setChatInputs((prev) => ({
        ...prev,
        [idRoom]: ""
      }));

      if (socket) {
        socket.emit("clientEvent", {
          idRoom,
          content,
          id_send: user?.id
        });
      }
    }
  };

  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleReceive = (data) => {
      setMessageChat((prev) => ({
        ...prev,
        [data.idRoom]: [
          ...(prev[data.idRoom] || []),
          {
            content: data.content,
            sender_id: data.id_send,
            conversation_id: data.idRoom,
            sender_username: data.username,
            sender_avatar: data.avatar
          }
        ]
      }));
    };

    const eventName = user.id.toString();
    socket.on(eventName, handleReceive);
    return () => {
      socket.off(eventName, handleReceive);
    };
  }, [socket, user]);

  return (
    <div className="flex gap-3">
      {litChat.map(
        (item, index) =>
          index <= 2 && (
            <MessengerMock
              key={item.idChat}
              idChat={item.idChat}
              dataUser={item.user}
              handleClose={handleClose}
              messages={messages[item.idChat] || []}
              handleChat={handleChat}
              handleSubmit={handleSubmit}
              value={chatInputs[item.idChat] || ""}
              inputRefs={inputRefs}
            />
          )
      )}
    </div>
  );
}
