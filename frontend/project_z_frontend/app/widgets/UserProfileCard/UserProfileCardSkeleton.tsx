export const UserProfileCardSkeleton = () => (
    <div className="bg-background rounded-2xl p-8 animate-pulse border border-border">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-background-muted rounded-full" />
            <div className="flex flex-col gap-3">
                <div className="h-8 w-48 bg-background-muted rounded" />
                <div className="h-4 w-24 bg-background-muted rounded" />
            </div>
        </div>
        <div className="h-4 w-full bg-background-muted rounded mb-4" />
        <div className="h-4 w-2/3 bg-background-muted rounded" />
    </div>
);