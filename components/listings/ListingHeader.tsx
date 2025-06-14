import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function ListingHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold md:text-3xl">My Listings</h1>
      <Link href="/dashboard/listings/add">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </Link>
    </div>
  );
}
