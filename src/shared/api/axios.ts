import { logoutUser } from "@/features/auth/api/auth";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await logoutUser()
      }
      return Promise.reject(error);
    },
  );

export default api;
