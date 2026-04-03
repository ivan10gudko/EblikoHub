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

    const variantStyles = {
        fill: "bg-amber-500 text-white hover:bg-amber-400 shadow-sm",
        outline: "border-2 border-amber-500 text-amber-500 bg-transparent",
        "text-only": "text-gray-600 hover:text-amber-600 hover:underline px-0 py-0 bg-transparent",
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