import React from "react";

interface Props {
    children: string;
    color?: string;
    textColor?: string;
    size?: "lg" | "md" | "sm";
    border?: boolean;
    onClick?: () => void;
}

const Badge: React.FC<Props> = ({
    children,
    color,
    textColor,
    onClick,
    size = "sm",
    border = true
}) => {
    const sizeStyles = {
        sm: "py-1 px-3 text-xs rounded-lg",
        md: "py-2 px-4 text-sm rounded-xl",
        lg: "py-2 px-5 text-md rounded-xl",
    };

    const baseStyles = "flex w-fit items-center border transition-all hover:opacity-80";
    
    const cursorStyles = onClick ? "cursor-pointer" : "cursor-default";

    const defaultColors = !color && !textColor ? "text-background border-background" : "";

    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${cursorStyles} ${defaultColors}`;

    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            className={combinedClassName}
            onClick={onClick}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    onClick();
                }
            }}
            style={{
                backgroundColor: color,
                color: textColor,
                borderColor: border ? (textColor || color) : "transparent"
            }}
        >
            {children}
        </div>
    );
};

export default Badge;