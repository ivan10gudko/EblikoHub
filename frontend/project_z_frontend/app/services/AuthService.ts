import axios from "axios";
import { useNavigate } from "react-router";
import type { LoginFormData } from "~/components/AuthPage/Login"
import { supabase } from "~/lib/supabase"

export const handleLogin = async (e: React.FormEvent,formData:LoginFormData,setErrors:React.Dispatch<React.SetStateAction<LoginFormData>>) => {
    e.preventDefault()

   
    
    const { data, error } = await supabase.auth.signUp({
    email: 'valid.email@supabase.io',
    password: 'example-password'});
    if (error) {
        setErrors(prev => ({ ...prev, "password": error }))
    } else {
        navigate(`/auth/confirmEmail`);
    }
    
}
export const authService = {

    signUpSupabase: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    createBackendUser: async (userData: RegisterData, supabaseId: string) => {
        const response = await axios.post("http://localhost:8080/api/users", {
            ...userData,
            supabaseId,
        });
        return response.data;
    },

    getBackendProfile: async (supabaseId: string) => {
        const response = await axios.get(`http://localhost:8080/api/users/${supabaseId}`);
        return response.data;
    }
};