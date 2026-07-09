import { Button } from "../Button";

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
    label, count, isActive, onClick,
    className, activeClassName, inactiveClassName
}: StatusButtonProps) => {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className={`px-4 py-2 border-none rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 
                ${isActive
                    ? `${activeClassName}`
                    : `${inactiveClassName} ${className}`
                }`}
        >
            <span>{label}</span>
            {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-normal ${isActive ? "bg-background/20 text-foreground" : "bg-background/20 text-foreground/80"
                    }`}>
                    {count}
                </span>
            )}
        </Button>
    );
};