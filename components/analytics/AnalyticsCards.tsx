import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, DollarSign } from 'lucide-react';
import {
  AnalyticsData,
  formatNumber,
  formatCurrency,
  formatTrend,
} from '@/lib/analytics';
import { useInquiriesContext } from '@/providers/InquiriesProvider';

interface AnalyticsCardsProps {
  data: AnalyticsData | null;
  isLoading: boolean;
}

export function AnalyticsCards({ data, isLoading }: AnalyticsCardsProps) {
  const { inquiries } = useInquiriesContext();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Failed to load analytics data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Listing Views
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(summary.totalViews)}
          </div>
          <p
            className={`text-xs ${
              summary.viewsTrend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatTrend(summary.viewsTrend)} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Inquiries Received
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(inquiries.length)}
          </div>
          <p
            className={`text-xs ${
              summary.inquiriesTrend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatTrend(summary.inquiriesTrend)} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales Value (YTD)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {formatCurrency(summary.totalSalesValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Year to date performance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
