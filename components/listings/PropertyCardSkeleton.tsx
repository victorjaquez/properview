import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}
