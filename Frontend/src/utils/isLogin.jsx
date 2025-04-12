import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Giả sử bạn có một hàm kiểm tra trạng thái đăng nhập, ví dụ từ context hoặc localStorage
const isAuthenticated = () => {
  // Thay logic dưới đây bằng cách kiểm tra thực tế trạng thái đăng nhập của bạn
  return localStorage.getItem("token") !== null;
};
function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Nếu chưa đăng nhập, redirect về trang login và lưu lại vị trí hiện tại để sau login chuyển hướng về đó

    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default RequireAuth;
