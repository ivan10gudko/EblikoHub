import axios, { AxiosError } from "axios";
import { supabase } from "~/shared/lib/supabase";

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
