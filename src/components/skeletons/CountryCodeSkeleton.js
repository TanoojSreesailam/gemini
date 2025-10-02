// src/components/skeletons/CountryCodeSkeleton.js
const CountryCodeSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
      {/* Flag placeholder */}
      <div className="h-4 w-6 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
      {/* Code placeholder */}
      <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
      {/* Dropdown arrow placeholder */}
      <div className="h-3 w-3 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    </div>
  );
};

export default CountryCodeSkeleton;
