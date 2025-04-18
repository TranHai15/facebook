import React, { useEffect, useState } from "react";
import Post from "./Post";
import { axiosBackend } from "../../utils/http";

export default function ListPost() {
  const [post, setPost] = useState([]);

  const getAllPost = async () => {
    try {
      const res = await axiosBackend.get("/post");
      setPost(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPost();
  }, []);
  return (
    <div>
      {post.map((post, index) => (
        <span key={index}>
          <Post post={post} />
        </span>
      ))}
    </div>
  );
}
