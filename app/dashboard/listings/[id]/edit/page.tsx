'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ListingForm } from '@/components/listings/ListingForm';
import { useToast } from '@/hooks/useToast';
import type { Property } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [listing, setListing] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/properties/${id}`);
          if (!response.ok) {
            if (response.status === 404) throw new Error('Listing not found.');
            throw new Error('Failed to fetch listing details.');
          }
          const data = await response.json();
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

  const handleSubmit = async (data: Partial<Property>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update listing');
      }
      toast({
        title: 'Success!',
        description: 'Listing updated successfully',
      });
      router.push(`/dashboard/listings/${id}`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (error && !listing) {
    // Show error prominently if listing couldn't be fetched
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/listings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">
          {error}
        </p>
      )}
      <ListingForm
        initialData={listing}
        onSubmitForm={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
