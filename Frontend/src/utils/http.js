import axios from "axios";
import { refreshToken, showError } from "./function.js";
const axiosLogin = axios.create({
  baseURL: `${import.meta.env.VITE_API_BACKEND}`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // 🔥 Cho phép gửi và nhận cookie từ backend
});

// Interceptor để thêm accessToken vào header
axiosLogin.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosLogin.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
// khi đã đăng nhập
const axiosBackend = axios.create({
  baseURL: `${import.meta.env.VITE_API_BACKEND}`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // 🔥 Cho phép gửi và nhận cookie từ backend
});

// Interceptor để thêm accessToken vào header
axiosBackend.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (
      config.url !== "auth/login" &&
      config.url !== "auth/register" &&
      config.url !== "auth/refresh"
    ) {
      const data = localStorage.getItem("accessToken");
      // Kiểm tra nếu không có accessToken, chuyển hướng đến trang login hoặc xử lý lỗi
      if (!data) {
        showError("Phiên Hết Hạn Vui Lòng đăng Nhập Lại");
        return Promise.reject("No access token found, please log in.");
      }
      // Nếu có accessToken, thêm vào header Authorization
      config.headers["Authorization"] = `Bearer ${data}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosBackend.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // Kiểm tra các trường hợp token hết hạn
    const err = error?.response.data.errorCode;

    if (
      err == "TOKEN_EXPIRED" &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refresh = await refreshToken();
      if (!refresh) {
        showError("Phiên Hết Hạn Vui Lòng đăng Nhập Lại");
        localStorage.removeItem("accessToken");
        // window.location.reload();
      }
      originalRequest.headers["Authorization"] = `Bearer ${refresh}`;
      return axiosBackend(originalRequest);
    }
    return Promise.reject(error);
  }
);
export { axiosBackend, axiosLogin };
