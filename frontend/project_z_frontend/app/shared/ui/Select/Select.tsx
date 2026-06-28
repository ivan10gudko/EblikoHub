import React, { useId, useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
    className?: string;
    disabled?: boolean;
    triggerColorClass?: string;
    getOptionClass?: (value: string | number) => string;
}

const SELECT_CLASSES = {
    base: "w-full flex items-center justify-between rounded-lg border px-4 py-2 text-[13px] font-medium outline-none transition-all cursor-pointer select-none text-left disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
    error: "border-danger focus:ring-1 focus:ring-danger ring-danger",
    default: "border-border/60 focus:border-primary focus:ring-1 focus:ring-primary"
};

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    className = "",
    error,
    disabled,
    triggerColorClass = "",
    getOptionClass,
}) => {
    const id = useId();
    const [open, setOpen] = useState(false);

    
    useEffect(() => {
        const handleScroll = () => {
            if (open) {
                setOpen(false);
            }
        };

      
        window.addEventListener("scroll", handleScroll, { capture: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll, { capture: true });
        };
    }, [open]);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    const isMargin = (c: string) => c.startsWith('m-') || c.startsWith('mb-') || c.startsWith('mt-') || c.startsWith('mx-') || c.startsWith('my-');
    const containerClasses = className.split(' ').filter(isMargin).join(' ');
    
    const selectClasses = className
        .split(' ')
        .filter(c => !isMargin(c) && c !== 'text-foreground')
        .join(' ');

    const hasCustomBg = className.includes("bg-");
    const backgroundStyle = hasCustomBg ? "" : "bg-background";

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
                            ${selectClasses}
                        `}
                    >
                        <span className={`truncate ${triggerColorClass ? triggerColorClass : "text-foreground"}`}>
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
                        onInteractOutside={() => setOpen(false)}
                        className="
                            z-[3000] 
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
                                div::-webkit-scrollbar { display: none; }
                            `}</style>
                            
                            {placeholder && (
                                <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider select-none">
                                    {placeholder}
                                </div>
                            )}

                            {options.map((option) => {
                                const isSelected = String(option.value) === String(value);
                                const optionColorClass = getOptionClass ? getOptionClass(option.value) : "text-foreground";

                                return (
                                    <DropdownMenu.Item key={option.value} asChild>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(String(option.value));
                                                setOpen(false);
                                            }}
                                            className={`
                                                w-full text-left rounded-lg px-3 py-2 text-[13px] font-medium transition-all mb-0.5 last:mb-0 flex items-center justify-between outline-none cursor-pointer select-none text-foreground
                                                ${isSelected ? "bg-muted font-semibold" : "hover:bg-muted/40 active:bg-muted"}
                                            `}
                                        >
                                            <span className={optionColorClass}>
                                                {option.label}
                                            </span>

                                            {isSelected && (
                                                <svg className={`h-3.5 w-3.5 flex-shrink-0 stroke-current ${optionColorClass}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
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

            {error && <span className="text-xs text-danger ml-1 mt-0.5">{error}</span>}
        </div>
    );
};

export default Select;