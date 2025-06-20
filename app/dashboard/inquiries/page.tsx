'use client';

import { useInquiriesContext } from '@/providers/InquiriesProvider';
import { InquiriesLoadingSkeleton } from '@/components/inquiries/InquiriesLoadingSkeleton';
import { InquiriesTable } from '@/components/inquiries/InquiriesTable';

export default function InquiriesPage() {
  const { inquiries, markAsRead, markAsUnread, isLoading, error } =
    useInquiriesContext();

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
        inquiries={inquiries}
        onMarkAsRead={markAsRead}
        onMarkAsUnread={markAsUnread}
      />
    </div>
  );
}
