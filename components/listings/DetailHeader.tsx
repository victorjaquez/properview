import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';

interface DetailHeaderProps {
  listingId: string;
  onDelete: () => void;
}

export function DetailHeader({ listingId, onDelete }: DetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/dashboard/listings">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>
      </Link>
      <div className="flex gap-2">
        <Link href={`/dashboard/listings/${listingId}/edit`}>
          <Button variant="outline" size="sm">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Listing
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-1 w-1" />
        </Button>
      </div>
    </div>
  );
}
