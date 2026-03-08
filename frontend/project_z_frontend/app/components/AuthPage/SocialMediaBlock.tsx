import { authService } from "~/services/AuthService";
import Button from "../Button"

import { FaDiscord } from "react-icons/fa";

const SocialMediaBlock: React.FC = ()=>{
    const handleDiscordLogin = async () => {
        try {
            await authService.signInWithOauth('discord');
        } catch (error) {
            console.error("Помилка ініціалізації OAuth:", error);
        }
    };
    return(
    <div className="flex items-center justify-between flex-col gap-4 font-medium text-black/50">
        <Button variant="outline" className="border-[1px] w-full flex" action={handleDiscordLogin}>
            Continue with <FaDiscord color="#5865F2" size={32} className="mx-4" />
        </Button>
    </div>)
}
export default SocialMediaBlock