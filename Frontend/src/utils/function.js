import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { axiosLogin } from "./http.js";
// Hàm thông báo đơn giản với các tham số mặc định
function showAlert(
  message,
  title = "Thông báo",
  icon = "info",
  background = "#f4f7fa",
  color = "#000",
  confirmButtonColor = "#3085d6",
  width = "400px",
  padding = "2em",
  backdrop = true
) {
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    confirmButtonText: "OK",
    background: background, // Tùy chỉnh nền
    color: color, // Tùy chỉnh màu chữ
    confirmButtonColor: confirmButtonColor, // Màu nút xác nhận
    width: width, // Độ rộng
    padding: padding, // Khoảng cách xung quanh nội dung
    backdrop: backdrop, // Màu nền mờ phía sau
    timer: 2000
  });
}

// Hàm xác nhận với các tham số mặc định
function showConfirm(
  message,
  title = "Xác nhận",
  icon = "warning",
  confirmButtonText = "OK",
  cancelButtonText = "Hủy",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  background = "#f4f7fa",
  width = "500px",
  padding = "2em",
  backdrop = "rgba(0, 0, 0, 0.5)",
  customClass = {}
) {
  return Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    confirmButtonColor: confirmButtonColor,
    cancelButtonColor: cancelButtonColor,
    background: background, // Tùy chỉnh nền
    width: width, // Độ rộng
    padding: padding,
    backdrop: backdrop, // Màu nền mờ
    customClass: {
      container: "custom-container", // Tùy chỉnh container của modal
      popup: "custom-popup", // Tùy chỉnh pop-up
      title: "custom-title", // Tùy chỉnh tiêu đề
      confirmButton: "custom-confirm", // Tùy chỉnh nút xác nhận
      ...customClass // Tùy chỉnh thêm nếu cần
    }
  }).then((result) => {
    return result.isConfirmed;
  });
}

// Hàm lỗi tự động đóng sau 3 giây
function showError(message) {
  Swal.fire({
    title: "Lỗi!",
    text: message,
    icon: "error",
    timer: 3000, // Tự động đóng sau 3 giây
    willClose: () => {
      console.log("Thông báo đã đóng");
    }
  });
}

// Hàm thông báo thành công với hình ảnh
function showSuccessWithImage(
  message,
  imageUrl = "https://example.com/your-image.png",
  imageWidth = 100,
  imageHeight = 100,
  imageAlt = "Custom image"
) {
  Swal.fire({
    title: "Thông báo",
    text: message,
    icon: "success",
    imageUrl: imageUrl, // Thêm hình ảnh
    imageWidth: imageWidth, // Kích thước hình ảnh
    imageHeight: imageHeight,
    imageAlt: imageAlt // Thêm mô tả cho hình ảnh
  });
}
const decodeData = (token) => {
  const decoded = jwtDecode(token);
  return decoded;
};

//  cấp lại accessToken

const refreshToken = async () => {
  try {
    const res = await axiosLogin.post("/auth/refresh");
    const accessToken = res.data?.newAccessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error(error);
  }
};
function getTimeDifference(oldDateISOString) {
  const oldDate = new Date(oldDateISOString);
  const now = new Date();

  const diffInMs = now - oldDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút `;
  } else if (diffInHours < 24) {
    const remainingMinutes = diffInMinutes % 60;
    if (remainingMinutes > 0) {
      return `${diffInHours} giờ `;
    }
    return `${diffInHours} giờ `;
  } else {
    return `${diffInDays} ngày `;
  }
}

export {
  showAlert,
  showConfirm,
  showError,
  showSuccessWithImage,
  decodeData,
  refreshToken,
  getTimeDifference
};
