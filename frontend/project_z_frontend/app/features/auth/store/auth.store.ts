import axios from 'axios';
import { create } from 'zustand';
import { authService, type RegisterData } from '~/entities/session';
import { generateFallbackName, userService, type CreateUserProfile } from '~/entities/user'; // UserProfile більше не потрібен тут
import { getErrorMessage } from '~/shared/utils/getErrorMessage';

interface AuthState {
    userId: string | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;

    loginWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (data: RegisterData & { password: string }) => Promise<void>;
    syncOAuthUser: (supabaseId: string, fallbackData?: Partial<RegisterData>) => Promise<void>;
    restoreSession: (supabaseId: string | null) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}


export const useAuthStore = create<AuthState>()((set) => ({
    userId: null,
    isAuth: false,
    isLoading: false,
    error: null,

    loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { user: supabaseUser } = await authService.login(email, password);
            
            if (!supabaseUser) throw new Error("Supabase login error");

            try {
                const userProfile = await userService.getUser(supabaseUser.id);
                set({ userId: userProfile.userId, isAuth: true, isLoading: false });
            
            } catch (backendError: unknown) {
                
                if (axios.isAxiosError(backendError) && backendError.response?.status === 404) {
                    try {
                        const newProfile = await userService.createFallbackUser(supabaseUser.id)
                        
                        set({ userId: newProfile.userId, isAuth: true, isLoading: false });
                    } catch (healError: unknown) {
                        set({ error: getErrorMessage(healError, "Critical profile restoration error"), isLoading: false });
                        throw healError;
                    }
                } else {
                    set({ error: getErrorMessage(backendError, "Server conection error"), isLoading: false });
                    throw backendError;
                }
            }
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, "Login error"), isLoading: false });
            throw error;
        }
    },

    signUpWithEmail: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const { user: supabaseUser } = await authService.signUp(data.email, data.password);
            
            if (!supabaseUser) throw new Error("Supabase sign up error");

            try {
                const payload: CreateUserProfile = {
                    userId: supabaseUser.id,
                    name: data.name,
                    nameTag: data.username
                };

                const userProfile = await userService.createUser(payload);
                set({ userId: userProfile.userId, isAuth: true, isLoading: false });
            } catch (backendError: unknown) {
                await authService.logout();
                
                const errorMsg = getErrorMessage(
                    backendError, 
                    "User not found. Try to sign up again, to restore session"
                );
                
                set({ error: errorMsg, isLoading: false });
                throw backendError;
            }
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, "Sign up error"), isLoading: false });
            throw error;
        }
    },

    syncOAuthUser: async (supabaseId, fallbackData) => {
        set({ isLoading: true, error: null });
        try {
            const userProfile = await userService.getUser(supabaseId);
            
            set({ userId: userProfile.userId, isAuth: true, isLoading: false });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404 && fallbackData) {
                try {
                    const altUserName = generateFallbackName();

                    const newUserData: CreateUserProfile = {
                        userId: supabaseId,
                        name: fallbackData.name || altUserName,
                        nameTag: fallbackData.username || altUserName,
                    };

                    const newUserProfile = await userService.createUser(newUserData);
                    set({ userId: newUserProfile.userId, isAuth: true, isLoading: false });
                } catch (createError: unknown) {
                    set({ error: getErrorMessage(createError, "OAuth auth error"), isLoading: false });
                    throw createError;
                }
            } else {
                set({ error: getErrorMessage(error, "OAuth sync error"), isLoading: false });
                throw error;
            }
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({ userId: null, isAuth: false, error: null, isLoading: false });
        } catch (error: unknown) {
            set({ error: getErrorMessage(error, "Logout error"), isLoading: false });
        }
    },

    restoreSession: async (supabaseId) => {
        if (!supabaseId) {
            set({ userId: null, isAuth: false, isLoading: false });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const userProfile = await userService.getUser(supabaseId);
            set({ userId: userProfile.userId, isAuth: true, isLoading: false });
        } catch (error: unknown) {
            console.error("Failed to restore user profile:", error);
            set({ userId: null, isAuth: false, error: "Session restore failed", isLoading: false });
        }
    },

    clearError: () => set({ error: null })
}));