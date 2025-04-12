import React, { useContext } from "react";
import MessengerMock from "./Message";
import HomeContext from "../../contexts/Client/HomeContenxt";

export default function ListMessage() {
  const { litChat, setListChat } = useContext(HomeContext);
  const handleClose = (id) => {
    setListChat(litChat.filter((item) => item.idChat != id));
  };
  return (
    <div>
      <div className="flex gap-3">
        {litChat.map(
          (item, index) =>
            index <= 2 && (
              <span key={index}>
                <MessengerMock idChat={item.idChat} handleClose={handleClose} />
              </span>
            )
        )}
      </div>
    </div>
  );
}
