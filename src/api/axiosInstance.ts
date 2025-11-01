import axios from "axios";
import { getAccessToken } from "@/utils/auth";

export const urlApi = "http://34.58.230.252/";

const instance = axios.create({
    baseURL: urlApi + "api/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

instance.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
