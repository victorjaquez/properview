import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/analytics';

interface ListingViewsChartProps {
  chartData: any[];
}

export function ListingViewsChart({ chartData }: ListingViewsChartProps) {
  const recentData = chartData.slice(-7);
  const maxViews = Math.max(...recentData.map((d) => d.views));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Listing Views Over Time
        </CardTitle>
        <CardDescription>
          Daily views trend for the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px]">
        <div className="h-full flex flex-col justify-end space-y-2">
          <div className="flex items-end space-x-1 sm:space-x-2 h-full mb-4">
            {recentData.map((day) => {
              const height = maxViews > 0 ? (day.views / maxViews) * 100 : 10;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center min-w-0"
                >
                  <div
                    className="w-full bg-primary rounded-t-sm min-h-[4px] flex items-end justify-center text-xs text-white font-medium"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  >
                    {day.views > 0 && (
                      <span className="mb-1 text-[10px] sm:text-xs">
                        {day.views}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Total:{' '}
            {formatNumber(
              recentData.reduce((sum, day) => sum + day.views, 0)
            )}{' '}
            views
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
