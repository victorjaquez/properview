'use client';

import { useInquiriesContext } from '@/providers/InquiriesProvider';
import { InquiriesLoadingSkeleton } from '@/components/inquiries/InquiriesLoadingSkeleton';
import { InquiriesTable } from '@/components/inquiries/InquiriesTable';
import { useProperties } from '@/hooks/useProperties';

export default function InquiriesPage() {
  const { inquiries, markAsRead, markAsUnread, isLoading, error } =
    useInquiriesContext();
  const { properties } = useProperties();

  // Join inquiries with property data
  const inquiriesWithProperties = inquiries.map((inquiry) => ({
    ...inquiry,
    property: properties.find((p) => p.id === inquiry.propertyId),
  }));

  if (isLoading) {
    return <InquiriesLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">Error loading inquiries: {error}</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Client Inquiries</h1>
      </div>

      <InquiriesTable
        inquiries={inquiriesWithProperties}
        onMarkAsRead={markAsRead}
        onMarkAsUnread={markAsUnread}
      />
    </div>
  );
}
