export function SongSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-11 h-11 rounded skeleton shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 skeleton" />
        <div className="h-2.5 w-1/2 skeleton" />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: 8 }).map((_, i) => <SongSkeleton key={i} />)}
    </div>
  );
}
