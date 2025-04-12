import React, { useContext } from "react";
import "./style.scss";
import { FacebookHeader } from "@components/index.js";
import AuthContext from "@contexts/Auth/AuthContext.jsx";
import Post from "@components/CreatePost/Post";
import ListPost from "../../../components/Post/ListPost";
import ListAddAccount from "../../../components/AddAccount/ListAddAccount";
import ListUser from "../../../components/ListUser/Listuser";
import ListMessage from "../../../components/Message/ListMessage";

export default function Home() {
  const { Location, Navigate } = useContext(AuthContext);
  return (
    <div className="">
      <div className="fixed z-50 left-0 right-0 top-0">
        <FacebookHeader />
      </div>
      <main className=" max-w-[36rem] mx-auto pt-20">
        <Post />
        <div>
          <ListPost />
        </div>
      </main>
      <div className="fixed right-0 top-[58px] max-w-[23rem] h-screen overflow-y-auto">
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
