import React, { Children } from "react";

import Sidebar from "@components/Layouts/Sidebar/Sidebar";
import FacebookHeader from "@components/Layouts/Header/Header.jsx";
export default function DefaultLayout({ children }) {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-[99]">
        <FacebookHeader />
      </header>
      <main>
        <div className="max-w-[37rem] min-w-[20rem] w-[50%] mx-auto mt-[80px]">
          {children}
        </div>
        <div className="fixed right-0">
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
