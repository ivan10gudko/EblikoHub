interface CompactRatingLabelProps {
    rating?: number | null;
    label?: string;
    className?: string; 
}

export const CompactRatingLabel = ({
    rating,
    label,
    className = "",
}: CompactRatingLabelProps) => {
    const hasRating = rating !== undefined && rating !== null;

    return (
        <div className={`flex items-center h-[34px] bg-transparent border border-border rounded-md overflow-hidden select-none ${className}`}>
            {label && (
                <div className="flex items-center justify-center px-2 h-full bg-background-muted/20 text-xs text-foreground-muted border-r border-border">
                    {label}
                </div>
            )}

            <div className="flex items-center justify-center h-full bg-background-muted/10 min-w-[30px] px-2">
                <span className={`text-sm ${hasRating ? "font-black text-primary" : "text-foreground-muted"}`}>
                    {hasRating ? rating.toFixed(1) : "—"}
                </span>
            </div>
        </div>
    );
};