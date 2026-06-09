import { UserAvatar } from "~/entities/user";

interface HeaderAvatarProps {
    src?: string;
    name: string;
    className?: string;
}

export const HeaderAvatar = ({ src, name, className }: HeaderAvatarProps) => {
    return (
        <div className={`transition-transform hover:scale-105 active:scale-95 ${className}`}>
            <UserAvatar src={src} name={name} size="sm" />
        </div>
    );
}