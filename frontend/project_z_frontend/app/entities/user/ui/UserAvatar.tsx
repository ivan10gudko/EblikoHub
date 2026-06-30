
interface UserAvatarProps {
    src?: string;
    name: string;
    size?: "sm" | "md" | "lg" | "min";
}

const sizes = {
    min: "w-5 h-5",
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-32 h-32"
};

export const UserAvatar = ({ src, name, size = "md" }: UserAvatarProps) => {
    return (
        <div className={`${sizes[size]} rounded-full overflow-hidden bg-background-muted`}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-background font-bold">
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
};