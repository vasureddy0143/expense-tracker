import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      const currentPath = window.location.pathname;

      if (error.response.status === 401) {
        // Only redirect to login if not already on login page
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }

      // Let the component-specific error handler handle the message
      return Promise.reject(error);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
      return Promise.reject(new Error("Request timeout. Please try again."));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
