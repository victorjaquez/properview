import { Card, CardContent } from '@/components/ui/card';
import { AnalyticsData } from '@/lib/analytics';
import { SkeletonCard } from './SkeletonCard';
import { ListingViewsChart } from './ListingViewsChart';
import { TopPropertiesCard } from './TopPropertiesCard';
import { DailyActivityCard } from './DailyActivityCard';

interface ChartPlaceholdersProps {
  data: AnalyticsData | null;
  isLoading: boolean;
}

export function ChartPlaceholders({ data, isLoading }: ChartPlaceholdersProps) {
  if (isLoading) {
    return (
      <>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 h-[250px] sm:h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Failed to load chart data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { chartData, topProperties } = data;

  return (
    <>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ListingViewsChart chartData={chartData} />
        <TopPropertiesCard topProperties={topProperties} />
      </div>
      <DailyActivityCard chartData={chartData} />
    </>
  );
}
