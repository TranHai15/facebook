import { createContext, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { axiosBackend } from "../../utils/http";
import AuthContext from "../Auth/AuthContext";
import { parsePath } from "react-router-dom";
const HomeContext = createContext();
export function HomeProvide({ children }) {
  const { user, socket } = useContext(AuthContext);
  const [isSearch, setSearch] = useState(false);
  const [isMessage, setMessage] = useState(false);
  const [isInfo, setInfo] = useState(false);
  const [isAccount, setAccount] = useState(false);
  const [litChat, setListChat] = useState([]);
  const [content, setContent] = useState([]);
  const [messages, setMessageChat] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // mở mặc định để xem trước
  const countNotificationInfo = useRef(0);
  const countNotificationMess = useRef(0);
  const [viewPost, setViewPost] = useState({});
  const [comment, setComment] = useState([]);
  const [like, setLike] = useState([]);
  const likeStatus = useRef({});

  const handleCountRead = (data) => {
    const countNof = data
      .filter((item) => item.type !== "message")
      .filter((item) => item.is_read == 1);

    const countMessage = data
      .filter((item) => item.type == "message")
      .filter((item) => item.is_read == 1);

    const a = countMessage.map((item) => ({
      id_to: item.from_user_id,
      id_send: item.user_id
    }));

    const uniquePairs = Array.from(
      new Set(a.map((item) => JSON.stringify(item)))
    ).map((str) => JSON.parse(str));

    const dataAll = {
      0: countNof.length,
      1: uniquePairs.length
    };
    return dataAll;
  };
  const fetchNotifications = async () => {
    try {
      const res = await axiosBackend.get("/notification");
      setNotifications(res.data.filter((item) => item.type !== "message"));
      const numberNotification = handleCountRead(res.data);
      countNotificationInfo.current = numberNotification[0];
      countNotificationMess.current = numberNotification[1];
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user?.role !== null) {
      fetchNotifications();
    }
  }, []);
  useEffect(() => {
    if (user.role !== null) {
      handleCountRead(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (!socket) return;
    const handleReceive = () => {
      fetchNotifications();
    };
    if (user.role !== null) {
      const idMen = `${user?.id.toString()}abc`;
      socket.on(idMen, handleReceive);
      return () => {
        socket.off(idMen, handleReceive);
      };
    }
  }, [socket]);
  const handleGetCommentById = async (id) => {
    try {
      const res = await axiosBackend.get(`/post/${id}`);
      if (res.status == 200) {
        // console.log("🚀 ~ handleGetCommentById ~ res:", res);
        setComment(res.data?.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPostById = async (id) => {
    try {
      const res = await axiosBackend.get(`/post/${id}`);
      if (res.status == 200) {
        setIsOpen(true);
        setViewPost(res.data?.post[0]);
        setComment(res.data?.comments);
        setLike(res.data?.likes);
        setInfo(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (id_post, id_to, type) => {
    try {
      const res = await axiosBackend.post(`/like`, {
        id_to: id_to,
        id_post: id_post,
        type: type
      });
      if (res.status == 200) {
        likeStatus.current[id_post] = !type;
        console.log("likeStatus", likeStatus.current[id_post]);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
        content,
        countNotificationInfo,
        notifications,
        setNotifications,
        fetchNotifications,
        countNotificationMess,
        isOpen,
        setIsOpen,
        viewPost,
        setViewPost,
        comment,
        setComment,
        like,
        setLike,
        handleGetPostById,
        handleLike,
        likeStatus,
        handleGetCommentById
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
export default HomeContext;
