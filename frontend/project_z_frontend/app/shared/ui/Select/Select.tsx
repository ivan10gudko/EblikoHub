import React, { useId, type ComponentProps } from "react";

export interface Option  {
    value: string | number;
    label: string;
}

interface SelectProps extends Omit<ComponentProps<"select">, "onChange"> {
    label?: string;
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    className = "",
    error,
    disabled,
    ...props
}) => {
    const id = useId();

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 ml-1"
                >
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <select
                    id={id}
                    className={`
                        w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-all
                        cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70
                        ${error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"}
                    `}
                    onChange={(e) => onChange(e.target.value)}
                    {...props}
                >
                    {placeholder && (
                        <option key='placeholder' value="">
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>

            {error && (
                <span className="text-xs text-red-500 ml-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;
