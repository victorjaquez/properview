import { useEffect, useState } from 'react';
import type { Property } from '@/components/types';

interface UsePropertyDetailReturn {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
}

export function usePropertyDetail(id: string): UsePropertyDetailReturn {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found or is not active.');
          }
          throw new Error('Failed to fetch listing details');
        }
        const data: Property = await response.json();
        if (data.status !== 'active') {
          throw new Error('This listing is not currently available.');
        }
        setProperty(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, isLoading, error };
}
