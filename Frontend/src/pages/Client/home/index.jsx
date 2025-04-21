import React, { useContext, useEffect } from "react";
import "./style.scss";
import ListPost from "@components/Post/ListPost";

import DefaultLayout from "../../../Layouts/DefaultLayout/DefaultLayout";
import Post from "@components/CreatePost/Post";
import ViewPost from "@components/Post/ViewPost";
import HomeContext from "@contexts/Client/HomeContenxt";

export default function Home() {
  const { isOpen, setIsOpen, viewPost, comment, like } =
    useContext(HomeContext);
  return (
    <div>
      <DefaultLayout>
        <Post />
        <ViewPost
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          post={viewPost}
          comments={comment}
          like={like}
        />
        <ListPost />
      </DefaultLayout>
    </div>
  );
}
