import React, { useId, useState, type ComponentProps } from 'react';

interface InputProps extends Omit<ComponentProps<"input">, "onChange"|"onBlur">{
    children?: string;
    name?: string;
    value: string | number;
    type?: React.HTMLInputTypeAttribute;
    pattern?: string;
    onChange: (value: string) => void;
    error?: string | boolean | null;
    isValid?:"valid"|"neutral"|"invalid"
    onBlur?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
    children,
    name,
    value,
    type = "text",
    pattern,
    onChange,
    onBlur,
    error,
    isValid="neutral",
    ...props
}) => {

    const id = useId();

    const isError = error || isValid === "invalid";
    const isSuccess = isValid === "valid";

    const getBorderColor = () => {
        if (isError) return "border-red-500 text-red-500 focus:border-red-400";
        if (isSuccess) return "border-green-400 text-green-400 focus:border-green-300";
        return "border-gray-300 focus:border-amber-200";
    };

    const getLabelColor = () => {
        if (isError) return "text-red-500 peer-focus:text-red-300";
        if (isSuccess) return "text-green-400 peer-focus:text-green-300";
        return "text-slate-600 peer-focus:text-amber-300";
    };

    return (
        <div className="relative">
            <input
                id={id}
                className={
                    `peer p-3 border-gray-300 border rounded-md w-full placeholder:text-sm placeholder:text-slate-600 focus:outline-0 ${getBorderColor()}`
            }
                type={type}
                name={name}
                placeholder={children}
                pattern={pattern}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => {
                    if (onBlur) onBlur(e.target.value);
                }}
                {...props}
            />
            <label htmlFor={id} className={`block peer-placeholder-shown:hidden absolute text-xs -top-2 left-4 bg-white px-2 ${getLabelColor()}`}>{name}</label>

            {isError && (
                <p className="text-red-500 w-full px-4 my-1 text-sm ">
                    {typeof error === 'string'? error:"Invalid format"}
                </p>
            )}
        </div>
    );
};

export default Input;