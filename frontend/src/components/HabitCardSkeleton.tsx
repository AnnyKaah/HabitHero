export default function HabitCardSkeleton() {
  // No changes needed here
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-700 flex flex-col justify-between h-full animate-pulse">
      <div>
        <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2"></div>
      </div>
      <div className="mt-4 w-full h-10 bg-slate-700 rounded-lg"></div>
    </div>
  );
}
