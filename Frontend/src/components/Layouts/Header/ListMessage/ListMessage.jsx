import React, { useState } from "react";
import Message from "./Message";
import Search from "../Search/Search";
import "./style.scss";
export default function ListMessage() {
  const [dataSearch, setDataSearch] = useState([
    {
      id: 1,
      image: "",
      title: "hello 1"
    },
    { id: 2, image: "", title: "hello 2" },
    { id: 3, image: "", title: "hello 3" },
    { id: 4, image: "", title: "hello 4" },
    { id: 5, image: "", title: "hello 5" },
    { id: 6, image: "", title: "hello 5" },
    { id: 7, image: "", title: "hello 5" },
    { id: 8, image: "", title: "hello 5" },
    { id: 9, image: "", title: "hello 6" }
  ]);

  const handleClose = (id) => {
    setDataSearch(dataSearch.filter((item) => item.id != id));
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
          <span className="font-bold px-3 py-2 bg-cyan-200 cursor-pointer rounded-2xl">
            Tất cả
          </span>
          <span className="font-bold px-3 py-2 rounded-2xl hover:bg-gray-200 cursor-pointer">
            Cộng đồng
          </span>
        </div>
      </div>
      {/* content */}
      <div className="message__content  scrollbar overflow-y-scroll">
        {dataSearch.length == 0 && (
          <p className="text-black font-bold text-center p-5">
            Không có tìm kiếm nào gần đây
          </p>
        )}
        {dataSearch.map((item, index) => (
          <span key={index}>
            <Search item={item} handleClose={handleClose} />
          </span>
        ))}
      </div>
    </div>
  );
}
