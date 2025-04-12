import React, { useState } from "react";
import Search from "./Search";
import "./style.scss";

export default function ListSearch({ handlePopup, searchInputRef }) {
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
    <div className="w-full h-full  ">
      <div className="flex items-center gap-1 h-[56px] px-3 pt-3">
        <div
          className="p-2 hover:bg-amber-100 rounded-2xl"
          onClick={() => handlePopup("isSearch")}
        >
          <img className="w-6 h-6" src="src/assets/icons/back.svg" />
        </div>
        <div className="fb-search ">
          <img className="w-4 h-4 " src="src/assets/icons/search.svg" />
          <input
            type="text"
            ref={searchInputRef}
            className=" ml-1 px-3 py-[8px] rounded-2xl input_search"
            placeholder="Tìm kiếm trên Facebook"
          />
        </div>
      </div>
      {/* content */}
      <div className="search__content scrollbar overflow-y-scroll max-h-[65svh]">
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