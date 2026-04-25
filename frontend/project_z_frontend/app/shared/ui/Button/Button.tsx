import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
    variant?: "fill" | "outline" | "text-only";
}

const Button = ({
    children,
    variant = "fill",
    className = "",
    type = "button",
    ...props
}: ButtonProps) => {

    const baseStyles = "px-4 py-2 rounded-lg flex justify-center items-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm hover:scale-98";


    const hasBg = className.includes("bg-");
    const hasText = className.includes("text-");
    const hasBorder = className.includes("border-");
    const variantStyles = {
        fill: `${!hasBg ? "bg-primary hover:bg-primary-hover" : ""} ${!hasText ? "text-background" : ""} shadow-sm`,
        outline: `border-2 ${!hasBorder ? "border-primary" : ""} ${!hasText ? "text-background" : ""}`,
        "text-only": "text-foreground-muted hover:text-primary hover:underline px-0 py-0 bg-transparent",
    };
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    return (
        <button
            type={type}
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;