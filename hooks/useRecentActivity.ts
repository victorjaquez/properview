import { useEffect, useState } from 'react';

export interface ActivityItem {
  id: string;
  type: 'listing' | 'inquiry' | 'price_update' | 'status_change';
  description: string;
  time: string;
  propertyId?: string;
  propertyTitle?: string;
}

interface UseRecentActivityReturn {
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
}

export function useRecentActivity(): UseRecentActivityReturn {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch recent activity');
        }
        const data: ActivityItem[] = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activities, isLoading, error };
}
