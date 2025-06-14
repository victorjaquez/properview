import { Skeleton } from '@/components/ui/skeleton';

export function PropertyDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
      <div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
