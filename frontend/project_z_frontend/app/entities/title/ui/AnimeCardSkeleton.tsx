
import React from 'react';

/**
 * Скелетон-заглушка для однієї картки.
 * Має анімований пульсуючий ефект.
 */
const AnimeSkeletonCard: React.FC = () => {
    return (
        <div className="w-full" aria-hidden="true">
            {/* Заглушка для зображення (постера) */}
            <div className="w-full aspect-[2/3] rounded-md bg-card animate-pulse"></div>
            
            {/* Заглушка для тексту (назва) */}
            <div className="h-5 w-3/4 rounded-md bg-cardanimate-pulse mt-3"></div>
            
            {/* Заглушка для тексту (підпис) */}
            <div className="h-4 w-1/2 rounded-md bg-card animate-pulse mt-2"></div>
        </div>
    );
};

export default AnimeSkeletonCard;