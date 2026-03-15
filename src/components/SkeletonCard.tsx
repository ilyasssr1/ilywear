export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="aspect-[3/4] w-full bg-gray-200"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-3 w-1/4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="h-5 w-1/3 bg-gray-200 rounded mt-auto"></div>
      </div>
      <div className="px-4 pb-4 mt-2">
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
