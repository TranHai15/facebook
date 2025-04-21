import React, { useEffect, useState } from "react";
import Search from "./Search";
import "./style.scss";
import { axiosBackend } from "@utils/http.js";
export default function ListSearch({ handlePopup, searchInputRef }) {
  function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
  }
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    // Gọi API search
    (async () => {
      try {
        const { data } = await axiosBackend.get(
          `/search?name=${encodeURIComponent(debouncedQuery)}`
        );
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    })();
  }, [debouncedQuery]);
  const onSelect = async (id) => {
    try {
      handlePopup("isSearch");
      window.location.href = `/profile/${id}`;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="w-full h-full  ">
      <div className="flex items-center gap-1 h-[56px] px-3 pt-3">
        <div
          className="p-2 hover:bg-amber-100 rounded-2xl"
          onClick={() => handlePopup("isSearch")}
        >
          <img
            className="w-6 h-6"
            src={`${
              import.meta.env.VITE_API_FRONTEND
            }/src/assets/icons/back.svg`}
          />
        </div>
        <div className="fb-search ">
          <img
            className="w-4 h-4 "
            src={`${
              import.meta.env.VITE_API_FRONTEND
            }/src/assets/icons/search.svg`}
          />
          <input
            type="text"
            ref={searchInputRef}
            placeholder="Tìm kiếm bạn bè theo tên..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {/* content */}
      <div className="search__content scrollbar overflow-y-scroll max-h-[65svh]">
        {results.length == 0 && (
          <p className="text-black font-bold text-center p-5">
            Không có tìm kiếm nào gần đây
          </p>
        )}
        {results.map((item) => (
          <Search key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
