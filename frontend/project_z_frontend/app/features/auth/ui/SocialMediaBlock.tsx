import { FaDiscord } from "react-icons/fa";
import { authService } from "~/entities/session";
import { Button } from "~/shared/ui/Button";

const SocialMediaBlock: React.FC = ()=>{
    const handleDiscordLogin = async () => {
        try {
            await authService.signInWithOauth('discord');
        } catch (error) {
            console.error("Помилка ініціалізації OAuth:", error);
        }
    };
    return(
    <div className="flex items-center justify-between flex-col gap-4 font-medium text-foreground">
        <Button variant="outline" className="border-[1px] w-full flex text-inherit border-black " onClick={handleDiscordLogin}>
            Continue with <FaDiscord color="#5865F2" size={32} className="mx-4" />
        </Button>
    </div>)
}
export default SocialMediaBlock