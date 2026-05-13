export function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          <div className="h-64 w-full rounded-[1.75rem] bg-slate-800 animate-pulse" />
          <div className="mt-5 space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-4 w-1/2 rounded-full bg-slate-800 animate-pulse" />
            <div className="flex gap-3">
              <div className="h-10 w-1/2 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-10 w-1/3 rounded-full bg-slate-800 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
