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
    themeVariant?: "light" | "dark";
}

const SELECT_CLASSES = {
    base: "w-full appearance-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
    error: "border-danger focus:ring-1 focus:ring-danger",
    default: "border-border focus:border-primary focus:ring-1 focus:ring-primary"
};

const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    themeVariant="light",
    className = "",
    error,
    disabled,
    ...props
}) => {
    const id = useId();

    const hasCustomBg = className.includes("bg-");
    const backgroundStyle = hasCustomBg ? "" : "bg-background";

    const isMargin = (c: string) => c.startsWith('m-') || c.startsWith('mb-') || c.startsWith('mt-') || c.startsWith('mx-') || c.startsWith('my-');
    const containerClasses = className.split(' ').filter(isMargin).join(' ');
    const selectClasses = className.split(' ').filter(c => !isMargin(c)).join(' ');

    const optionClasses = themeVariant === "dark" 
        ? "bg-[#1a1a1a]"
        : "bg-background text-foreground";


    return (
        <div className={`flex flex-col gap-1.5 w-full min-w-0 ${containerClasses}`}>
            {label && (
                <label
                    htmlFor={id}
                    className={`text-sm font-medium l-1 ${selectClasses.includes('text-') ? '' : "text-foreground" }`}
                >
                    {label}
                </label>
            )}

            <div className="relative w-full h-fit box-content">
                <select
                    id={id}
                    value={value}
                    className={`
                        ${SELECT_CLASSES.base}
                        ${backgroundStyle}
                        ${error ? SELECT_CLASSES.error : SELECT_CLASSES.default}
                        ${selectClasses}
                    `}
                    onChange={(e) => onChange(e.target.value)}
                    {...props}
                >
                    {placeholder && (
                        <option key='placeholder' value="" className = "text-foreground bg-background">
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option key={option.value} value={option.value} className={optionClasses}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className={`h-4 w-4 fill-current ${selectClasses.includes('text-') ? '' : 'text-foreground-muted'}`} viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>

            {error && (
                <span className="text-xs text-danger ml-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;
