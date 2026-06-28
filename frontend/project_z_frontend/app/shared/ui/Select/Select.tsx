import React, { useId, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Status, statusColorConfig } from "~/shared/types/Status"; 
import { TitleType, TitleTypeOptionsColors, TitleTypeThemes } from "~/entities/titleRecord/model/titleRecord";

export interface Option {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    themeVariant?: "light" | "dark";
    className?: string;
    disabled?: boolean;
}

const SELECT_CLASSES = {
    base: "w-full flex items-center justify-between rounded-lg border px-4 py-2 text-[13px] font-medium outline-none transition-all cursor-pointer select-none text-left disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
    error: "border-danger focus:ring-1 focus:ring-danger ring-danger",
    default: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary"
};

const getOptionTextColor = (optionValue: string | number) => {
    const valStr = String(optionValue);
    
    if (statusColorConfig[valStr as Status]) {
        return statusColorConfig[valStr as Status].color;
    }

    const upperVal = valStr.toUpperCase() as TitleType;
    if (TitleTypeOptionsColors[upperVal]) {
        return TitleTypeOptionsColors[upperVal];
    }

    return "";
};

const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    className = "",
    error,
    disabled,
}) => {
    const id = useId();
    const [open, setOpen] = useState(false);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    const isMargin = (c: string) => c.startsWith('m-') || c.startsWith('mb-') || c.startsWith('mt-') || c.startsWith('mx-') || c.startsWith('my-');
    const containerClasses = className.split(' ').filter(isMargin).join(' ');
    
    const selectClasses = className
        .split(' ')
        .filter(c => !isMargin(c) && c !== 'text-foreground')
        .join(' ');

    const hasCustomBg = className.includes("bg-");
    const backgroundStyle = hasCustomBg ? "" : "bg-background";

    const triggerColorClass = value ? getOptionTextColor(value) : "";

    React.useEffect(() => {
        if (!open) return;

        const handleScroll = () => setOpen(false);
        
        window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
    }, [open]);

    return (
        <div className={`flex flex-col gap-1.5 w-full min-w-0 ${containerClasses}`}>
            {label && (
                <label
                    htmlFor={id}
                    className={`text-xs font-medium ml-1 ${className.includes('text-') ? '' : "text-foreground"}`}
                >
                    {label}
                </label>
            )}

            <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
                <DropdownMenu.Trigger asChild>
                    <button
                        id={id}
                        type="button"
                        disabled={disabled}
                        className={`
                            ${SELECT_CLASSES.base}
                            ${backgroundStyle}
                            ${error ? SELECT_CLASSES.error : SELECT_CLASSES.default}
                            ${triggerColorClass ? triggerColorClass : "text-foreground"}
                            ${selectClasses}
                        `}
                    >
                        <span className="truncate">
                            {selectedOption ? selectedOption.label : (placeholder || "Select option...")}
                        </span>
                        <svg className="h-3.5 w-3.5 fill-current text-muted-foreground ml-2 shrink-0" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="start"
                        sideOffset={6}
                        onInteractOutside={(e) => setOpen(false)}
                        className="
                            z-[9999] 
                            w-[var(--radix-dropdown-menu-trigger-width)] 
                            min-w-[var(--radix-dropdown-menu-trigger-width)] 
                            bg-card border border-border rounded-lg shadow-xl overflow-hidden p-1
                            
                            
                            [[data-state]]:!block
                            
                            
                            data-[state=open]:animate-enter
                            data-[state=closed]:animate-leave
                        "
                    >
                        <div 
                            className="w-full max-h-60 overflow-y-auto"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <style>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            
                            {placeholder && (
                                <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    {placeholder}
                                </div>
                            )}

                            {options.map((option) => {
                                const isSelected = String(option.value) === String(value);
                                const optionColorClass = getOptionTextColor(option.value);

                                return (
                                    <DropdownMenu.Item
                                        key={option.value}
                                        asChild
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(String(option.value));
                                                setOpen(false);
                                            }}
                                            className={`
                                                w-full text-left rounded-lg px-3 py-2 text-[13px] font-medium transition-all mb-0.5 last:mb-0 flex items-center justify-between outline-none cursor-pointer select-none
                                                ${isSelected 
                                                    ? "bg-[#2a2a2a] font-semibold" 
                                                    : "hover:bg-muted/40 active:bg-muted"
                                                }
                                                ${optionColorClass || "text-foreground"}
                                            `}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <svg className="h-3.5 w-3.5 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    </DropdownMenu.Item>
                                );
                            })}
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {error && (
                <span className="text-xs text-danger ml-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;