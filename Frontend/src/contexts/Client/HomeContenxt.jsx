import { createContext, useState } from "react";
import React from "react";

const HomeContext = createContext();

export function HomeProvide({ children }) {
  const [isSearch, setSearch] = useState(false);
  const [isMessage, setMessage] = useState(false);
  const [isInfo, setInfo] = useState(false);
  const [isAccount, setAccount] = useState(false);
  const [litChat, setListChat] = useState([]);
  const [content, setContent] = useState([]);
  const [messages, setMessageChat] = useState({});
  return (
    <HomeContext.Provider
      value={{
        isSearch,
        setSearch,
        isMessage,
        setMessage,
        isInfo,
        setInfo,
        isAccount,
        setAccount,
        setListChat,
        litChat,
        setMessageChat,
        messages,
        setContent,
        content
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
export default HomeContext;
