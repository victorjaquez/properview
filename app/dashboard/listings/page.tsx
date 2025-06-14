'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import type { Property } from '@/components/types';
import { ListingHeader } from '@/components/listings/ListingHeader';
import { LoadingSkeleton } from '@/components/listings/LoadingSkeleton';
import { EmptyState } from '@/components/listings/EmptyState';
import { ListingCard } from '@/components/listings/ListingCard';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useConfirm } from '@/hooks/useConfirm';

export default function AgentListingsPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen,
    isLoading: isDeleting,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm();
  const { agent } = useAuth();

  useEffect(() => {
    if (agent) {
      const fetchListings = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/agent/properties');
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
    }
  }, [agent]);

  const handleDelete = async (id: string) => {
    confirm(async () => {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      setListings(listings.filter((listing) => listing.id !== id));
    });
  };

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
      <ListingHeader />

      {listings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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
