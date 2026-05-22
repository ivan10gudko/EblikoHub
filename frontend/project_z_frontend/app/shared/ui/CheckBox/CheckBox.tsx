import React, { useId, type ComponentProps } from "react";

interface CheckboxProps extends Omit<ComponentProps<"input">, "onChange" | "value"> {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    themeVariant?: "light" | "dark";
}

const CHECKBOX_CLASSES = {
    base: "h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50 select-none",
    error: "border-danger peer-focus:ring-1 peer-focus:ring-danger",
    default: "border-border peer-focus:border-primary peer-focus:ring-1 peer-focus:ring-primary peer-checked:border-primary peer-checked:bg-primary"
};

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    themeVariant = "light",
    className = "",
    error,
    disabled,
    ...props
}) => {
    const id = useId();

    const isMargin = (c: string) => c.startsWith('m-') || c.startsWith('mb-') || c.startsWith('mt-') || c.startsWith('mx-') || c.startsWith('my-');
    const containerClasses = className.split(' ').filter(isMargin).join(' ');
    const checkboxClasses = className.split(' ').filter(c => !isMargin(c)).join(' ');

    const hasCustomBg = className.includes("bg-");
    const backgroundStyle = hasCustomBg ? "" : "bg-background";

    return (
        <div className={`flex flex-col gap-1 w-full min-w-0 ${containerClasses}`}>
            <label
                htmlFor={id}
                className="flex items-start gap-3 cursor-pointer select-none group w-fit"
            >
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                    {...props}
                />

                <div
                    className={`
                        checkbox-box
                        ${CHECKBOX_CLASSES.base}
                        ${backgroundStyle}
                        ${error ? CHECKBOX_CLASSES.error : CHECKBOX_CLASSES.default}
                        ${checkboxClasses}
                    `}
                >
                   
                    <svg
                        className={`h-3.5 w-3.5 stroke-[#121212] stroke-[3.5] fill-none transition-all duration-200 ${checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
                            }`}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </div>

                {label && (
                    <span
                        className={`text-sm font-medium leading-5 transition-colors peer-disabled:opacity-50 ${checkboxClasses.includes('text-') ? '' : "text-foreground"
                            }`}
                    >
                        {label}
                    </span>
                )}
            </label>

            {error && (
                <span className="text-xs text-danger ml-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Checkbox;