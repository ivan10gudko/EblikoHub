import React from 'react';

interface SkeletonProps {
    type?: "fill" | "outline" | "text-only";
    className?: string;
}

const ButtonSkeleton: React.FC<SkeletonProps> = ({ 
    type = "fill",
    className = ""
}) => {
    
    const baseClasses = "animate-pulse bg-gray-300 cursor-default pointer-events-none rounded";

    const getShapeClasses = () => {
        if(type=="text-only") return "h-6 w-20 rounded";
        
        return "h-10 w-24 rounded-md";
    };

    return (
        <div
            className={`${baseClasses} ${getShapeClasses()} ${className}`}
        />
    );
};

export default ButtonSkeleton;