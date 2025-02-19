import axios from "axios";
import { fecthCookies } from "./cookiesGet";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const idToken = await fecthCookies();
  config.headers.Authorization = `Bearer ${idToken}`;
  return config;
});

export default axiosInstance;
