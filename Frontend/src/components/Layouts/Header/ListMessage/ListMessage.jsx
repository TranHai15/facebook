import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import "./style.scss";
import { axiosBackend } from "../../../../utils/http";
import HomeContext from "../../../../contexts/Client/HomeContenxt";
export default function ListMessage() {
  const [dataMessage, setDataMessage] = useState([]);
  const getAllMessageChat = async () => {
    try {
      const res = await axiosBackend.get("/messageChat");
      setDataMessage(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const check = useRef(false);
  useEffect(() => {
    getAllMessageChat();
  }, []);
  const handelFilter = (type) => {
    if (type === true) {
      check.current = true;
      setDataMessage((prev) => prev.filter((n) => n.typeGroup == 1));
    }
    if (type === false) {
      check.current = false;
      getAllMessageChat();
    }
  };
  const { litChat, setListChat, setMessageChat, setMessage } =
    useContext(HomeContext);
  const handleMessage = async (id, users) => {
    setMessage(false);
    const isExist = litChat.some((item) => item.idChat === id);
    const kq = await getRoomByChat(id);
    let idRoom = kq?.idChat;
    let message = kq?.chatMessage;
    if (!isExist) {
      setListChat((prev) => [{ idChat: idRoom, user: users }, ...prev]);
      setMessageChat((pre) => ({
        ...pre,
        [idRoom]: message
      }));
    }
  };
  const getRoomByChat = async (id) => {
    try {
      const res = await axiosBackend.post("/chat", {
        col: "message",
        idChat: id
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full">
      <h3 className="text-2xl text-black font-bold py-2 px-3">Đoạn chat</h3>
      <div className=" h-[120px] px-3 pt-3 pb-3">
        <div className="search__message rounded-2xl relative  w-full pl-0">
          <img
            className="w-4 h-4 absolute left-0 translate-x-1/2 translate-y-1/2"
            src="src/assets/icons/search.svg"
          />
          <input
            type="text"
            className=" ml-1 px-3 py-[8px] w-ful rounded-2xl input_search"
            placeholder="Tìm kiếm trên Facebook"
          />
        </div>
        <div className="flex text-black gap-2 pt-4">
          <span
            className={`font-bold px-3 py-2 cursor-pointer rounded-2xl ${
              check.current ? "hover:bg-gray-200" : " bg-cyan-200"
            }`}
            onClick={() => handelFilter(false)}
          >
            Tất cả
          </span>
          <span
            className={`font-bold px-3 py-2 cursor-pointer rounded-2xl ${
              !check.current ? "hover:bg-gray-200" : " bg-cyan-200"
            }`}
            onClick={() => handelFilter(true)}
          >
            Cộng đồng
          </span>
        </div>
      </div>
      {/* content */}
      <div className="message__content  scrollbar overflow-y-scroll px-4">
        {dataMessage.length == 0 && (
          <p className="text-black font-bold text-center p-5">
            Không có tìm kiếm nào gần đây
          </p>
        )}
        {dataMessage.map((item, index) => (
          <span key={index}>
            <Message messages={item} handleMessage={handleMessage} />
          </span>
        ))}
      </div>
    </div>
  );
}
