import React, { useState } from "react";
import Search from "../Search/Search";

export default function Info() {
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
      <h3 className="text-2xl text-black font-bold py-2 px-3">Thông báo</h3>
      <div className=" h-[50px] px-3 pt-2 pb-3">
        <div className="flex text-black gap-2 ">
          <span className="font-bold px-3 py-2 bg-cyan-200 cursor-pointer rounded-2xl">
            Tất cả
          </span>
          <span className="font-bold px-3 py-2 rounded-2xl hover:bg-gray-200 cursor-pointer">
            Chưa đọc
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
