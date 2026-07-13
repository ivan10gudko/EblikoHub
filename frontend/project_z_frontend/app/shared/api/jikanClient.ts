import axios from "axios";
const API_URL = import.meta.env.VITE_ANIME_API_URL || "https://api.tenrai.org/v1";
export const jikanClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});