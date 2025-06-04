import Navbar from "../components/Navbar";

const SearchPageSkeleton = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-10 animate-pulse">
        <div className="h-6 w-60 bg-gray-300 rounded mb-6" />
        <div className="w-full max-w-xl space-y-4">
          <div className="h-12 bg-gray-300 rounded" /> 
          <div className="h-48 bg-gray-200 rounded" /> 
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    </>
  );
};

export default SearchPageSkeleton;
