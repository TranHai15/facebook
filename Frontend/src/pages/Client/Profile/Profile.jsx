import React, { useContext, useEffect, useRef, useState } from "react";
import { axiosBackend } from "@utils/http";
import { useParams } from "react-router-dom";
import Post from "../../../components/Post/Post";
import AuthContext from "../../../contexts/Auth/AuthContext";
import { showAlert } from "../../../utils/function";
import HomeContext from "../../../contexts/Client/HomeContenxt";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { setListChat, setMessageChat } = useContext(HomeContext);

  const [userInfo, setUserInfo] = useState(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState([]);
  const idAddFriend = useRef(null);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState("");

  const isYourProfile = user?.id == id;

  // Fetch profile data
  const fetchData = async () => {
    try {
      const res = await axiosBackend.get(`/profile/${id}`);
      const data = res.data;
      setUserInfo(data?.user);
      setFriendsCount(data?.friends.length);
      setPosts(data?.friendStatus || []);
      idAddFriend.current = data?.friendStatus?.[0]?.id || null;
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch posts
  const getAllPost = async () => {
    try {
      const res = await axiosBackend.post("/postProfile", { idProfile: id });
      setPost(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Begin editing: prefill fields
  const openEdit = () => {
    setNewName(userInfo.username || "");
    setNewAvatar(null);
    setError("");
    setIsEditing(true);
  };

  // Submit edit profile
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (newName.trim().length < 3) {
      setError("Tên phải có ít nhất 3 ký tự");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", newName.trim());
      if (newAvatar) formData.append("avatar", newAvatar);
      const res = await axiosBackend.post("/postEditProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 200) {
        showAlert("Cập nhật thành công");
        setIsEditing(false);
        setError("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi cập nhật");
    }
  };

  // Other handlers (friend, message) ...
  const handleAdd = async (senderId, id_friend) => {
    try {
      const res = await axiosBackend.post("/addFriend", {
        idFriend: senderId,
        idTable: id_friend
      });
      if (res.status === 200) {
        showAlert("Đã chấp nhận lời mời kết bạn");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddReq = async (id_friend) => {
    try {
      const res = await axiosBackend.post("/sendFriendRequest", {
        idFriend: id_friend
      });
      if (res.status === 200 && res.data[0]?.affectedRows === 1) fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id_friend) => {
    try {
      const res = await axiosBackend.post("/deleteFriend", {
        idTable: id_friend || idAddFriend.current,
        id_friend: userInfo?.id
      });
      if (res.status === 200) {
        showAlert("Đã hủy lời mời kết bạn");
        idAddFriend.current = null;
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMessage = async (targetUser) => {
    const res = await axiosBackend.post("/chat", {
      sender_id: targetUser.id,
      type: "private"
    });
    const { idChat, chatMessage } = res.data;
    setListChat((prev) =>
      prev.some((c) => c.idChat === idChat)
        ? prev
        : [{ idChat, user: targetUser }, ...prev]
    );
    setMessageChat((prev) => ({ ...prev, [idChat]: chatMessage }));
  };

  // Render friend actions
  const renderFriendActions = () => {
    if (isYourProfile) return null;
    const status = posts[0]?.status;
    const senderId = posts[0]?.sender_id;
    const receiverId = posts[0]?.receiver_id;
    if (status === "accepted") {
      return (
        <div className="flex space-x-2 gap-2">
          <button
            disabled
            className="px-5 py-2 bg-gray-200 text-gray-600 rounded"
          >
            Bạn bè
          </button>
          <button
            onClick={() => handleMessage(userInfo)}
            className="px-5 py-2 bg-blue-500 text-white rounded"
          >
            Nhắn tin
          </button>
        </div>
      );
    }
    if (status === "pending") {
      if (user.id === senderId) {
        return (
          <div className="flex space-x-2  gap-2">
            <button disabled className="px-5 py-2 bg-gray-200 rounded">
              Đã gửi
            </button>
            <button
              onClick={() => handleDelete(idAddFriend.current)}
              className="px-5 py-2 bg-red-300 rounded"
            >
              Hủy lời mời
            </button>
          </div>
        );
      } else if (user.id === receiverId) {
        return (
          <div className="flex space-x-2  gap-2">
            <button
              onClick={() => handleAdd(senderId, posts[0]?.id)}
              className="px-5 py-2 bg-green-500 text-white rounded"
            >
              Chấp nhận
            </button>
            <button
              onClick={() => handleDelete(idAddFriend.current)}
              className="px-5 py-2 bg-red-300 rounded"
            >
              Từ chối
            </button>
          </div>
        );
      }
    }
    return (
      <button
        onClick={() => handleAddReq(userInfo.id)}
        className="px-5 py-2 bg-green-500 text-white rounded"
      >
        Kết bạn
      </button>
    );
  };

  useEffect(() => {
    fetchData();
    getAllPost();
  }, [id]);

  if (!userInfo) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-50">
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hồ sơ</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên mới
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAvatar(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:border file:rounded file:px-3 file:py-2"
                />
              </div>
              {/* Image preview */}
              {newAvatar && (
                <div className="w-24 h-24 mx-auto overflow-hidden rounded-full">
                  <img
                    src={URL.createObjectURL(newAvatar)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover & Profile Info */}
      <div className="h-72 relative">
        <img
          src="https://cdn.ketnoibongda.vn/media-c/1140-402-100/upload/images/bg-default.jpg"
          alt="Cover"
          className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end">
          <div className="relative">
            <img
              src={
                import.meta.env.VITE_API_BACKEND + "/" + userInfo.avatar ||
                "/default-avatar.png"
              }
              alt={userInfo.username}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            {isYourProfile && (
              <button
                onClick={openEdit}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6 6L6 21l-3-3 6-6z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="ml-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">{userInfo.username}</h1>
              {isYourProfile && !isEditing && (
                <button
                  onClick={openEdit}
                  className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                >
                  Sửa thông tin
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-1">{friendsCount} bạn bè</p>
          </div>
        </div>

        <div className="absolute bottom-[-2rem] right-6">
          {renderFriendActions()}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-6 mt-20 space-y-6">
        {post.length === 0 ? (
          <p className="text-gray-500">Chưa có bài viết nào.</p>
        ) : (
          post.map((p, idx) => <Post key={idx} post={p} />)
        )}
      </div>
    </div>
  );
}
