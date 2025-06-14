'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Property } from '@/components/types';
import { DetailHeader } from '@/components/listings/DetailHeader';
import { DetailLoadingSkeleton } from '@/components/listings/DetailLoadingSkeleton';
import { DetailNotFound } from '@/components/listings/DetailNotFound';
import { ListingDetails } from '@/components/listings/ListingDetails';

export default function PublicListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/properties/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Listing not found');
            }
            throw new Error('Failed to fetch listing details');
          }
          const data: Property = await response.json();
          setListing(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchListing();
    }
  }, [id]);

  if (isLoading) {
    return <DetailLoadingSkeleton />;
  }

  if (error || !listing) {
    return <DetailNotFound error={error || undefined} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <DetailHeader
        listingId={listing.id}
        onDelete={() => {}} // No delete for public listings
        isAdmin={false} // No admin actions for public listings
        backUrl="/dashboard/public-listings"
      />
      <ListingDetails listing={listing} />
    </div>
  );
}
