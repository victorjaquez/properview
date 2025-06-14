'use client';

import { AnalyticsCards } from '@/components/analytics/AnalyticsCards';
import { ChartPlaceholders } from '@/components/analytics/ChartPlaceholders';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading, error, refetch } = useAnalytics();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Performance Analytics
        </h1>
        <Button
          variant="outline"
          onClick={refetch}
          disabled={isLoading}
          className="flex items-center gap-2 self-start sm:self-auto"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive">
          <p className="font-medium">Failed to load analytics data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <AnalyticsCards data={data} isLoading={isLoading} />

      <ChartPlaceholders data={data} isLoading={isLoading} />
    </div>
  );
}
