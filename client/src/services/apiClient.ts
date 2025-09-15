/* eslint-disable */
import axios from "axios";

const BASEURL = import.meta.env.VITE_API_BASEURL!;
const apiClient = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) {
        try {
          const res = await axios.post(`${BASEURL}/auth/refresh`, {
            refresh_token,
          });
          const { access_token, expires_at } = res.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("expires_at", expires_at);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (error: any) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.replace("/");
        }
      } else {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
