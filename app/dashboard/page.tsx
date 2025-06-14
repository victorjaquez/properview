'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PerformanceSnapshot } from '@/components/dashboard/PerformanceSnapshot';
import { TopPropertiesCard } from '@/components/analytics/TopPropertiesCard';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useAnalytics } from '@/hooks/useAnalytics';
import { PlusCircle } from 'lucide-react';

export default function DashboardOverviewPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Dashboard Overview
        </h1>
        <Link href="/dashboard/listings/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
          </Button>
        </Link>
      </div>

      <StatsGrid stats={stats} isLoading={statsLoading} />

      <div className="grid gap-6 md:grid-cols-2">
        <TopPropertiesCard topProperties={analyticsData?.topProperties || []} />
        <PerformanceSnapshot stats={stats} isLoading={statsLoading} />
      </div>

      <RecentActivity activities={activities} isLoading={activitiesLoading} />
    </div>
  );
}
