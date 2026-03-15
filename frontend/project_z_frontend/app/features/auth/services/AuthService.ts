import { supabase } from "~/lib/supabase";
import type { Providers } from "~/features/auth/types/auth.types";

export const authService = {

    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        return data;
    },

    login : async (email: string, password: string)=>{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error;

        return data;
    },

    updatePassword: async (password:string)=>{
        const { data, error } = await supabase.auth.updateUser({ password })

        if (error) throw error;

        return data;
    },

    signInWithOauth: async (provider: Providers = 'discord') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        }
    })

    if (error) throw error;

    return data;
},

    logout : async () => {
        const {error} = await supabase.auth.signOut();
        if(error) throw error;
    },
};