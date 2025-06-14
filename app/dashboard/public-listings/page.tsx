'use client';

import { useEffect, useState } from 'react';
import type { Property } from '@/components/types';
import { LoadingSkeleton } from '@/components/listings/LoadingSkeleton';
import { PropertyCard } from '@/components/listings/PropertyCard';

export default function PublicListingsPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">Error loading listings: {error}</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Public Listings
          </h1>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No public listings available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <PropertyCard
              key={listing.id}
              property={listing}
              href={`/dashboard/public-listings/${listing.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
