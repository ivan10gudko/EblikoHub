import { notify } from "../lib";
import { getSessionUserId } from "../lib/supabase";


export const checkAuthAndRun = async (action: () => void) => {
    const userId = await getSessionUserId();
    if (!userId) {
        notify.error("Please sign in first to perform this action");
        return;
    }
    action();
};