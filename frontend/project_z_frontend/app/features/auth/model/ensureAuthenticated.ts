import { getSessionUserId } from "~/shared/lib/supabase";
import { useAuthStore } from "../store/auth.store";


export const ensureAuthenticated = async () => {
    let { userId } = useAuthStore.getState();

    if (!userId) {
        const idFromSession = await getSessionUserId();
        
        if (idFromSession) {
            userId = idFromSession;
            await useAuthStore.getState().restoreSession(idFromSession);
        }
    }

    return userId;
};