
import React from 'react';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface CollapsibleSectionSkeletonProps {
    title: React.ReactNode;
    renderItem: ( key: string | number ) => React.ReactNode;

}
const CollapsibleSectionSkeleton = ({ title,renderItem }:CollapsibleSectionSkeletonProps) => {
    
    const skeletonItems = Array.from({ length: 6 });

    return (
        <div className="w-full border-y px-2 md:px-8 lg:px-20" aria-busy="true" aria-label={`Loading ${title}`}>
            {/* Заголовок */}
            <div className="mt-10 border-b flex justify-between items-center px-2">
                {/* Показуємо справжній заголовок, це покращує UX */}
                <h3 className="text-2xl text-gray-800">
                    {title}
                </h3>
                
                {/* Скелетон для кнопки */}
                <div className="p-1 rounded-full cursor-wait">
                    {/* Використовуємо іконку, але робимо її "заглушкою" */}
                    <ArrowDropDownRoundedIcon sx={{ fontSize: 40, color: '#e0e0e0' }} />
                </div>
            </div>

            {/* Сітка скелетонів. Використовуємо ТІ Ж САМІ класи, що й у реальному компоненті */}
            <div className="w-full grid xl:gap-y-10 grid-cols-2 md:grid-cols-4 xl:grid-cols-5 grid-rows-1 grid-flow-col overflow-hidden 2xl:grid-cols-6 gap-6 py-6 justify-between">
                {skeletonItems.map((_, index) => (
                    renderItem(index)
                ))}
            </div>
        </div>
    );
};

export default CollapsibleSectionSkeleton;