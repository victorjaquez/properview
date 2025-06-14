import { useEffect, useState } from 'react';
import type { Property } from '@/components/types';

interface UsePropertiesReturn {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

export function useProperties(): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data: Property[] = await response.json();
        setProperties(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, isLoading, error };
}
