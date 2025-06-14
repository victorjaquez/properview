import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import type { ActivityItem } from '@/hooks/useRecentActivity';
import { getActivityIcon, formatActivityType } from '@/lib/dashboardUtils';

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const router = useRouter();

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.type === 'inquiry') {
      router.push('/dashboard/inquiries');
    } else if (activity.propertyId) {
      // For listings and other property-related activities
      router.push(`/dashboard/listings/${activity.propertyId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates on your listings and inquiries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity to display.
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleActivityClick(activity)}
            >
              <div className="p-1 rounded-md bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {formatActivityType(activity.type)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <p className="ml-auto text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
