import { create } from 'zustand';
import { authService } from '~/features/auth/services/AuthService';
import { userService } from '~/features/auth/services/UserService';
import type { RegisterData } from '~/features/auth/types/auth.types';
import type { CreateUserProfile, UserProfile} from "~/features/auth/types/user.types";

interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;

    loginWithEmail: (email: string, password: string) => Promise<void>;
    
    signUpWithEmail: (data: RegisterData & { password: string }) => Promise<void>;
    
    syncOAuthUser: (supabaseId: string, fallbackData?: Partial<RegisterData>) => Promise<void>;
    restoreSession : (supabaseId:string|null)=>Promise<void>;
    
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isLoading: false,
    error: null,

    loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            
            const { user: supabaseUser } = await authService.login(email, password);
            
            if (!supabaseUser) throw new Error("Supabase login error");

            const userProfile = await userService.getUser(supabaseUser.id);
            
            set({ user: userProfile, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Login error", isLoading: false });
            throw error;
        }
    },

    signUpWithEmail: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const { user: supabaseUser } = await authService.signUp(data.email, data.password);
            
            if (!supabaseUser) throw new Error("Supabase sign up error");

            const payload : CreateUserProfile = {
                        userId: supabaseUser.id,
                        name: data.name,
                        nameTag: data.username
            }

            const userProfile = await userService.createUser(payload);
            
            set({ user: userProfile, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Sign Up error", isLoading: false });
            throw error;
        }
    },

    syncOAuthUser: async (supabaseId, fallbackData) => {
        set({ isLoading: true, error: null });
        try {
            const userProfile = await userService.getUser(supabaseId);
            set({ user: userProfile, isLoading: false });
            
        } catch (error: any) {
            if (error.response?.status === 404 && fallbackData) {
                try {
                    const altUserName = `user_${Date.now()}`;
                    const newUserData: CreateUserProfile = {
                        userId: supabaseId,
                        name: fallbackData.name || altUserName,
                        nameTag: fallbackData.username || altUserName,
                    };

                    const newUserProfile = await userService.createUser(newUserData);
                    set({ user: newUserProfile, isLoading: false });
                } catch (createError: any) {
                    set({ error: "OAuth auth error", isLoading: false });
                    throw createError;
                }
            } else {
                set({ error: "OAuth sync error", isLoading: false });
                throw error;
            }
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({ user: null, error: null, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    restoreSession: async (supabaseId) => {
        if (!supabaseId) {
            set({ user: null, isLoading: false });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const userProfile = await userService.getUser(supabaseId);
            set({ user: userProfile, isLoading: false });
        } catch (error: any) {
            console.error("Failed to restore user profile:", error);
            set({ user: null, error: "Session restore failed", isLoading: false });
        }
    },

    clearError: () => set({ error: null })
}));