'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyDetails } from '@/components/listings/PropertyDetails';
import { PropertyInquiryForm } from '@/components/listings/PropertyInquiryForm';
import { PropertyDetailSkeleton } from '@/components/listings/PropertyDetailSkeleton';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import { usePropertyInquiry } from '@/hooks/usePropertyInquiry';
import { trackListingViewDebounced } from '@/lib/analytics';

export default function PublicListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { property, isLoading, error } = usePropertyDetail(id);
  const { isSubmitting, successMessage, errorMessage, submitInquiry } =
    usePropertyInquiry();

  // Track listing view when property is loaded
  useEffect(() => {
    if (property && !isLoading && !error) {
      trackListingViewDebounced(property.id);
    }
  }, [property, isLoading, error]);

  const handleInquirySubmit = async (data: any) => {
    if (property) {
      await submitInquiry(data, property.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        {isLoading && (
          <>
            <div className="mb-6">
              <Button variant="outline" size="sm" disabled>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Listings
              </Button>
            </div>
            <PropertyDetailSkeleton />
          </>
        )}

        {!isLoading && (error || !property) && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-destructive mb-4">
              {error || 'Listing not found.'}
            </h2>
            <Link href="/listings">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Listings
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && property && (
          <>
            <div className="mb-6">
              <Link href="/listings">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Listings
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <PropertyDetails property={property} />
              </div>

              <div className="md:col-span-1">
                <PropertyInquiryForm
                  propertyId={property.id}
                  isSubmitting={isSubmitting}
                  onSubmit={handleInquirySubmit}
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                />
              </div>
            </div>
          </>
        )}
      </main>
      <footer className="text-center p-4 border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ProperView. All rights reserved.
      </footer>
    </div>
  );
}
