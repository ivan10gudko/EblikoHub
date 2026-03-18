import React from "react";

const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full flex h-[88vh] flex-row-reverse relative *:animate-pulse bg-black text-white">
      {/* Фон */}
      <div className="w-1/2 h-full bg-gray-800"></div>

      {/* Контент */}
      <div className="absolute w-full h-full bg-gradient-to-r from-black via-black/80 to-transparent py-8 lg:py-24 md:px-2 lg:px-20">
        <div className="w-full md:w-2/3 xl:w-1/2 max-md:bg-gradient-to-t from-black via-black/85 to-transparent max-md:py-4 max-md:px-4 space-y-4">
          {/* Badge */}
          <div className="h-5 w-32 bg-gray-700 rounded"></div>

          {/* Title */}
          <div className="h-8 w-2/3 bg-gray-600 rounded"></div>
          <div className="h-8 w-1/2 bg-gray-700 rounded"></div>

          {/* Rating & Date */}
          <div className="flex gap-4">
            <div className="h-5 w-12 bg-gray-700 rounded"></div>
            <div className="h-5 w-12 bg-gray-700 rounded"></div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-20 bg-gray-700 rounded"></div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
          </div>

          {/* Buttons */}
          <div className="flex gap-8 mt-6">
            <div className="h-10 w-32 bg-gray-600 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-600 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
