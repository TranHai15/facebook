import React, { Children } from "react";

import Sidebar from "@components/Layouts/Sidebar/Sidebar";
import FacebookHeader from "@components/Layouts/Header/Header.jsx";
import ListMessage from "../../components/Message/ListMessage";
export default function ProfileLayout({ children }) {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-[99]">
        <FacebookHeader />
      </header>
      <main>
        <div className="max-w-[60rem] min-w-[20rem] w-[80%] mx-auto mt-[58px]">
          {children}
        </div>
        <div className="fixed bottom-0 right-4 justify-end pr-16">
          <ListMessage />
        </div>
      </main>
    </div>
  );
}
