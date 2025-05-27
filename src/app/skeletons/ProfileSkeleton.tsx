"use client";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-[600px] text-white animate-pulse px-4 py-8 max-w-4xl mx-auto space-y-6">

      {/* Compact profile card skeleton */}
      <div className="flex items-center space-x-4 bg-gray-800 rounded-xl p-4">
        <div className="w-20 h-20 rounded-full bg-gray-700"></div>
          <div className="h-6 bg-gray-700 rounded w-3/5"></div>
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-700 rounded w-12"></div>
          </div>
      </div>
      
      {/* Favorite movies section skeleton */}
      <div className="bg-gray-800 rounded-xl shadow-md p-6 mt-6 space-y-4">
        <div className="flex space-x-4 overflow-x-auto justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-36 bg-gray-700 rounded-md flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex space-x-6 bg-gray-800 pb-2 justify-center rounded-xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-700 rounded w-65 m-3"></div>
        ))}
      </div>
    </div>
  );
}
