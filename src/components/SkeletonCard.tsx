export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
      <div className="aspect-[16/9] shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-2/3 rounded shimmer"></div>
        <div className="h-2.5 w-1/3 rounded shimmer"></div>
        <div className="h-2.5 w-full rounded shimmer"></div>
        <div className="h-2.5 w-5/6 rounded shimmer"></div>
        <div className="h-7 w-24 rounded shimmer"></div>
      </div>
    </div>
  );
}
