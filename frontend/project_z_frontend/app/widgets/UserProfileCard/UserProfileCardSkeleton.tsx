export const UserProfileCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-8 animate-pulse border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-full" />
            <div className="flex flex-col gap-3">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded mb-4" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
);