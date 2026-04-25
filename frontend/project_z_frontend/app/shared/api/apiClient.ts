import axios, { AxiosError } from "axios";
import { supabase } from "../lib";
import toast from "react-hot-toast";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

apiClient.interceptors.request.use(
    async (config) => {
        const session = await supabase.auth.getSession();
        const token = session?.data.session?.access_token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
apiClient.interceptors.response.use(
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