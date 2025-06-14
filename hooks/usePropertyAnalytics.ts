import { useEffect, useState } from 'react';

interface PropertyAnalytics {
  views: number;
  inquiries: number;
  uniqueVisitors: number;
}

export function usePropertyAnalytics(propertyId: string) {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/properties/${propertyId}/analytics`);
      if (!response.ok) {
        throw new Error('Failed to fetch property analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [propertyId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!propertyId) return;

    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [propertyId]);

  return { analytics, isLoading, error, refetch: fetchAnalytics };
}
