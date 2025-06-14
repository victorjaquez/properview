import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/hooks/useDashboardStats';

interface PerformanceSnapshotProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export function PerformanceSnapshot({
  stats,
  isLoading,
}: PerformanceSnapshotProps) {
  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Snapshot</CardTitle>
          <CardDescription>
            Quick overview of your listing engagement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-8 w-32" />
        </CardFooter>
      </Card>
    );
  }

  const performanceMetrics = [
    {
      label: 'Average Listing Views',
      value: stats.averageViews.toLocaleString(),
      progress: Math.min((stats.averageViews / 500) * 100, 100),
      ariaLabel: 'Average listing views progress',
    },
    {
      label: 'Inquiry Conversion Rate',
      value: `${stats.conversionRate}%`,
      progress: stats.conversionRate,
      ariaLabel: 'Inquiry conversion rate',
    },
    {
      label: 'Average Time on Market',
      value: `${stats.averageTimeOnMarket} Days`,
      progress: Math.max(100 - (stats.averageTimeOnMarket / 180) * 100, 0),
      ariaLabel: 'Average time on market',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Snapshot</CardTitle>
        <CardDescription>
          Quick overview of your listing engagement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performanceMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{metric.label}</span>
                <span>{metric.value}</span>
              </div>
              <Progress value={metric.progress} aria-label={metric.ariaLabel} />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href="/dashboard/analytics">
          <Button variant="outline" size="sm">
            View Full Analytics
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
