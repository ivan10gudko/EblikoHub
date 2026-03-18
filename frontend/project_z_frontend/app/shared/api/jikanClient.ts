import axios from "axios";

export const jikanClient = axios.create({
    baseURL: "https://api.jikan.moe/v4",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});