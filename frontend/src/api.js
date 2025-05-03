import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({ baseURL: "", withCredentials: true});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem(REFRESH_TOKEN);
      if (refresh) {
        try {
          const { data } = await axios.post(
            `/letrajato/token/refresh/`,
            { refresh }
          );
          localStorage.setItem(ACCESS_TOKEN, data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (e) {
          console.error("Refresh token failed", e);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;