import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { decodeData, showAlert, showError } from "../../utils/function";
import { axiosBackend } from "@utils/http";
import { connectSocket, disconnectSocket, getSocket } from "../../utils/socket";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const Navigate = useNavigate();
  const Location = useLocation();
  const accessToken = localStorage.getItem("accessToken") ?? null;
  const you = JSON.parse(localStorage.getItem("user")) ?? null;
  const [socket, setSocket] = useState(null);
  let role = null;
  let id = null;
  let avatar = you?.image;
  let username = you?.name;

  if (accessToken != null) {
    const dataUser = decodeData(accessToken);
    role = dataUser?.is_admin;
    id = dataUser?.id;
  }

  const [user, setUser] = useState({
    role: role,
    id: id,
    avatar: avatar,
    username: username
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    const { id } = decodeData(accessToken);
    try {
      const res = await axiosBackend.post("/auth/logout", { id: id });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      showAlert(res?.data?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (accessToken) {
      const sock = connectSocket(accessToken);
      setSocket(getSocket(sock));
    }
    return () => {
      disconnectSocket();
    };
  }, [accessToken]);
  return (
    <AuthContext.Provider
      value={{
        Navigate,
        Location,
        Link,
        setUser,
        user,
        setIsLoading,
        isLoading,
        handleLogout,
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
