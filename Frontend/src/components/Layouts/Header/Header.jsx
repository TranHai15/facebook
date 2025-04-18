import React, { useEffect, useRef } from "react";
import "./style.scss";
import { useContext } from "react";
import HomeContext from "../../../contexts/Client/HomeContenxt";
import ListSearch from "./Search/ListSearch";
import ListMessage from "./ListMessage/ListMessage";
import InfoAccount from "./InfoAccount/InfofAccount";
import ListInfo from "./ListInfor/ListInfo";

export default function FacebookHeader() {
  const {
    isSearch,
    setSearch,
    isMessage,
    setMessage,
    isInfo,
    setInfo,
    isAccount,
    setAccount
  } = useContext(HomeContext);
  const searchInputRef = useRef(null);

  const handlePopup = (value) => {
    setMessage(false);
    setSearch(false);
    setInfo(false);
    setAccount(false);
    if (value == "isMessage") {
      setMessage(!isMessage);
    } else if (value == "isSearch") {
      setSearch(!isSearch);
    } else if (value == "isInfo") {
      setInfo(!isInfo);
    } else if (value == "isAccount") {
      setAccount(!isAccount);
    }
  };

  useEffect(() => {
    if (isSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearch]);
  return (
    <header className="fb-header">
      {/* Bên trái: Logo  và tìm kiếm*/}

      <div className="fb-header__left relative">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          alt="Facebook Logo"
          className="fb-logo"
        />
        <div className="fb-search ">
          <img className="w-4 h-4 " src="src/assets/icons/search.svg" />
          <input
            type="text"
            onClick={() => handlePopup("isSearch")}
            className=" ml-1 p-[5px] rounded-2xl"
            placeholder="Tìm kiếm trên Facebook"
          />
        </div>
        {/* popup search */}
        {isSearch && (
          <div className="duration-300 popup__search fixed top-0 left-0 w-full min-w-[20rem] max-w-[21rem] z-[95]    bg-white shadow-2xl">
            <ListSearch
              handlePopup={handlePopup}
              searchInputRef={searchInputRef}
            />
          </div>
        )}
      </div>

      {/* Giữa: Các icon và profile */}
      <div className="fb-header__center">
        <div className="py-3 px-10 icon_center item_icon">
          <img className="w-6 h-6" src="src/assets/icons/home_icon.svg" />
        </div>
        <div className="py-3 px-10 item_icon">
          <img className="w-6 h-6" src="src/assets/icons/tivi.svg" />
        </div>
        <div className="py-3 px-10 item_icon ">
          <img className="w-6 h-6" src="src/assets/icons/nhom.svg" />
        </div>
        <div className="py-3 px-10 item_icon">
          <img className="w-6 h-6" src="src/assets/icons/muahang.svg" />
        </div>
        <div className="py-3 px-10 item_icon">
          <img className="w-6 h-6" src="src/assets/icons/game.svg" />
        </div>
      </div>
      {/* right  */}
      <div className="fb-header__right">
        <div
          className="fb-header__icon"
          onClick={() => handlePopup("isMessage")}
        >
          <img className="w-7 h-7 " src="src/assets/icons/message.svg" />
        </div>
        {/* popup search */}
        {isMessage && (
          <div className="duration-300 popup__search fixed top-[57px] right-[16px] w-full min-w-[20rem] max-w-[21rem] z-[95]   bg-white shadow-2xl">
            <ListMessage />
          </div>
        )}
        <div className="fb-header__icon" onClick={() => handlePopup("isInfo")}>
          <img className="w-7 h-7 " src="src/assets/icons/beld.svg" />
        </div>
        {isInfo && (
          <div className="duration-300 popup__search fixed top-[57px] right-[16px] w-full min-w-[20rem] max-w-[21rem] z-[95]  bg-white shadow-2xl">
            <ListInfo />
          </div>
        )}
        <div
          className="fb-header__profile relative"
          onClick={() => handlePopup("isAccount")}
        >
          <img
            src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
            alt="Profile"
          />
          <div className="w-4 h-4 rounded-2xl flex items-center justify-center absolute bottom-0 right-0 bg-white">
            <div className="w-3 h-3 bg-gray-100 rounded-2xl  flex items-center justify-center">
              <img
                className="w-4 object-cover h-4 "
                src="src/assets/icons/down.svg"
              />
            </div>
          </div>
        </div>
        {isAccount && (
          <div className="duration-300 popup__search fixed top-[57px] right-[16px] w-full min-w-[20rem] max-w-[21rem] z-[95]  ">
            <InfoAccount />
          </div>
        )}
      </div>
    </header>
  );
}
