import axios from "axios";
import toast from "react-hot-toast";

export const publicClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    
});
publicClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 402) {
            toast.error("Something went wrong, try later");
        }
        return Promise.reject(error);
    }
);