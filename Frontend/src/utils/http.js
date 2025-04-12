import axios from "axios";
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
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axiosBackend;
