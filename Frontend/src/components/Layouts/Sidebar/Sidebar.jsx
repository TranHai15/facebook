import React from "react";
import ListAddAccount from "../../AddAccount/ListAddAccount";
import ListUser from "../../ListUser/Listuser";
import ListMessage from "../../Message/ListMessage";

export default function Sidebar() {
  return (
    <div>
      <div className="fixed right-0 top-[58px] max-w-[23rem] w-[24%] min-w-[17rem] h-screen overflow-y-auto">
        <div>
          <ListAddAccount />
        </div>
        <div>
          <ListUser />
        </div>
      </div>
      <div className=" w-full fixed bottom-0 left-0 right-0">
        <div className="flex justify-end pr-16">
          <ListMessage />
        </div>
      </div>
    </div>
  );
}
