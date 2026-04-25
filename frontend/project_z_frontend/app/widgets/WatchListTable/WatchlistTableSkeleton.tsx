export const WatchlistSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {/* Хедер скелетон */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="h-8 w-48 bg-card rounded-lg"></div>
        <div className="h-10 w-32 bg-card rounded-xl"></div>
      </div>

      {/* Рядки скелетони (рендеримо 5 штук) */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col sm:flex-row items-center gap-4 bg-card p-2 rounded-xl border border-border h-[120px] sm:h-[60px]"
        >
          <div className="flex items-center flex-1 gap-3 w-full">
            <div className="w-8 h-8 bg-card rounded-lg shrink-0"></div> {/* Кнопка видалення */}
            <div className="w-16 h-10 bg-background-muted rounded-md shrink-0"></div> {/* Картинка */}
            <div className="h-4 bg-background-muted rounded w-full max-w-[200px]"></div> {/* Назва */}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="h-8 w-32 bg-background-muted rounded-lg"></div> {/* Селект */}
            <div className="h-8 w-24 bg-background-muted rounded-lg"></div> {/* Рейтинг */}
          </div>
        </div>
      ))}
    </div>
  );
};