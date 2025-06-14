import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Home, MessageSquare, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DashboardStats } from '@/hooks/useDashboardStats';

interface StatsGridProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const router = useRouter();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-3 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Listings',
      value: stats.totalListings.toString(),
      change: `${stats.activeListings} active`,
      icon: <Home className="h-5 w-5 text-primary" />,
      description: 'Active and pending listings',
      route: '/dashboard/listings',
    },
    {
      title: 'New Inquiries',
      value: stats.newInquiries.toString(),
      change: 'This month',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      description: 'Unread messages from potential buyers',
      route: '/dashboard/inquiries',
    },
    {
      title: 'Properties Sold (Month)',
      value: stats.soldThisMonth.toString(),
      change: `Value: $${(stats.totalValueSold / 1000000).toFixed(1)}M`,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      description: 'Closed deals this month',
    },
    {
      title: 'Average Listing Views',
      value: stats.averageViews.toString(),
      change: `${stats.conversionRate}% conversion`,
      icon: <Eye className="h-5 w-5 text-primary" />,
      description: 'Average views per active listing',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card
          key={stat.title}
          className={
            stat.route ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
          }
          onClick={stat.route ? () => router.push(stat.route) : undefined}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
