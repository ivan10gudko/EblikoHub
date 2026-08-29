export const RoomGroupWatchlistSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border h-[56px] w-full"
        >
          <div className="w-6 h-6 bg-background-muted rounded-md shrink-0"></div>
          <div className="w-16 h-10 bg-background-muted rounded-md shrink-0"></div>
          <div className="h-4 bg-background-muted rounded w-full max-w-[200px]"></div>
        </div>
      ))}
    </div>
  );
};