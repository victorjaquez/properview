'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';

interface DetailHeaderProps {
  listingId: string;
  onDelete: () => void;
  isAdmin?: boolean;
  backUrl?: string;
}

export function DetailHeader({
  listingId,
  onDelete,
  isAdmin = false,
  backUrl,
}: DetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" size="sm" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      {isAdmin && (
        <div className="flex gap-2">
          <Link href={`/dashboard/listings/${listingId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Listing
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
