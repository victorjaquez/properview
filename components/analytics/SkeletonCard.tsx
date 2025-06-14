import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px] flex items-center justify-center">
        <div className="h-24 w-24 bg-muted animate-pulse rounded"></div>
      </CardContent>
    </Card>
  );
}
