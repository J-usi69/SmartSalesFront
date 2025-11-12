import { AppConfig } from "@/config/app-config";
import axios from "axios";

const url = AppConfig.API_URL;
const api = axios.create({
  baseURL: url + "/",
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default api;
