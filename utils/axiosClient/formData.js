import axios from "axios";
import { API_BASE_URL } from "../../services/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosFromData = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With",
  },
});

axiosFromData.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  config.baseURL = API_BASE_URL;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (config.method === "get" || config.method === "path") {
      const param = config.params;
      if (param) {
        config.params = param;
      }
    } else {
      const data = config.data;
      if (data) {
        config.data = data;
      }
    }
  }
  return config;
});

axiosFromData.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response;
    }
    return response;
  },
  (error) => {
    return error;
  }
);

export default axiosFromData;
