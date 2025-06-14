'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Property } from '../../../../components/types';
import { DetailHeader } from '@/components/listings/DetailHeader';
import { DetailLoadingSkeleton } from '@/components/listings/DetailLoadingSkeleton';
import { DetailNotFound } from '@/components/listings/DetailNotFound';
import { ListingDetails } from '@/components/listings/ListingDetails';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useConfirm } from '@/hooks/use-confirm';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [listing, setListing] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen,
    isLoading: isDeleting,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm();

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

  const handleDelete = async () => {
    if (!listing) return;

    confirm(async () => {
      const response = await fetch(`/api/properties/${listing.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      router.push('/dashboard/listings');
    });
  };

  if (isLoading) {
    return <DetailLoadingSkeleton />;
  }

  if (error || !listing) {
    return <DetailNotFound error={error || undefined} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <DetailHeader listingId={listing.id} onDelete={handleDelete} />
      <ListingDetails listing={listing} />

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleCancel}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={handleConfirm}
        isLoading={isDeleting}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
