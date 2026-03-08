import type { ComponentProps, ReactElement } from "react";

interface ButtonProps extends ComponentProps<"button">{
    children:React.ReactNode| string,
    variant?:"fill"|"outline"|"text-only",
    action?: (() => void) | ((e: React.MouseEvent<HTMLElement>) => void);
    color ?:string,
    bgColor?: string,
    className?: string,
    borderColor?:string,
    htmlType?: 'button' | 'submit' | 'reset',
}

const Button = ({
    children,
    variant,
    action,
    color = "black",
    bgColor = "white",
    className ="",
    borderColor,
    htmlType = 'button',
    ...props
}:ButtonProps)=> {
    
    switch (variant) {

    case "fill":
        return (
            <button
                type={htmlType}
                onClick={action}
                className={"px-3 py-2 rounded-md flex justify-center hover:opacity-80  items-center cursor-pointer " + " "+className}
                style={{ color: color, background: bgColor }}
                {...props}
            >
            {children}
            </button>
        );
    case "outline":
        return (
            <button
                type={htmlType}
                onClick={action}
                className={"px-3 py-2 border-2 rounded-md border-opacity-70 flex justify-center items-center cursor-pointer "+ " "+className}
                style={{ color: color,borderColor: borderColor ?? color}}
                {...props}
            >
                {children}
            </button>
        );
    case "text-only":
        return (
            <button
                type={htmlType}
                onClick={action}
                className={"hover:underline transition-all duration-100 delay-75 flex justify-center items-center cursor-pointer "+ " "+className}
                style={{ color: color}}
                {...props}
            >
                {children}
            </button>
        );
    default:
        return (
            <button
                type={htmlType}
                onClick={action}
                className={"px-3 py-2 border-2 rounded-md flex justify-center items-center"+ " "+className}
                style={{ color: color,borderColor: borderColor ?? color,}}
                {...props}
            >
                {children}
            </button>
        );
    }
}

export default Button;