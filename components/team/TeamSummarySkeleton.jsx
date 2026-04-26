export default function TeamSummarySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse mb-2" />
          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
