'use client';

import { ListingForm } from '@/components/listings/ListingForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import type { Property } from '@/types';

export default function AddListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: Omit<Property, 'id' | 'agentId' | 'dateListed'>
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create listing');
      }
      toast({
        title: 'Success!',
        description: 'Listing created successfully',
      });
      router.push('/dashboard/listings');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ListingForm onSubmitForm={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
