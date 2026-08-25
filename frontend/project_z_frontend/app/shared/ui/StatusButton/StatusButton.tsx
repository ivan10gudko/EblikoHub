import { Button } from "../Button";
import { cn } from "~/shared/lib";

interface StatusButtonProps {
    label: string;
    count?: number;
    isActive: boolean;
    onClick: () => void;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
}

export const StatusButton = ({
    label,
    count,
    isActive,
    onClick,
    className = "",
    activeClassName = "",
    inactiveClassName = ""
}: StatusButtonProps) => {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className={cn(
                "h-11 px-4 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold text-sm active:scale-[0.97]",
                isActive ? activeClassName : cn(inactiveClassName, className)
            )}
        >
            <span>{label}</span>
            {count !== undefined && (
                <span
                    className={cn(
                        "px-2 py-0.5 rounded-lg text-xs font-bold transition-all border",
                        isActive
                            ? "bg-card border-border text-foreground"
                            : "bg-background-muted border-border text-foreground-muted"
                    )}
                >
                    {count}
                </span>
            )}
        </Button>
    );
};