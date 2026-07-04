interface ToggleSwitchProps {
    isActive: boolean;
    onToggle: (active: boolean) => void;
    className?: string;
    label?: string;
}

export const ToggleSwitch = ({ isActive, onToggle, className = "" }: ToggleSwitchProps) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => onToggle(!isActive)}
            className={` relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? "bg-primary" : "bg-foreground/70"
                } ${className}`}
        >
            <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isActive ? "translate-x-5" : "translate-x-1"
                    }`}
            />
        </button>
    );
};