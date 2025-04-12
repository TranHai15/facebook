import React, { useContext } from "react";
import "./style.scss";
import AuthContext from "@contexts/Auth/AuthContext.jsx";
import ListPost from "@components/Post/ListPost";

import DefaultLayout from "../../../Layouts/DefaultLayout/DefaultLayout";
import Post from "@components/CreatePost/Post";

export default function Home() {
  const { Location, Navigate } = useContext(AuthContext);
  return (
    <div>
      <DefaultLayout>
        <Post />
        <ListPost />
      </DefaultLayout>
    </div>
  );
}
