import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DetailNotFoundProps {
  error?: string;
}

export function DetailNotFound({ error }: DetailNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <h1 className="text-2xl font-semibold">Listing Not Found</h1>
      <p className="text-muted-foreground mb-4">
        {error ||
          'The listing you are looking for does not exist or has been removed.'}
      </p>
      <Link href="/dashboard/listings">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>
      </Link>
    </div>
  );
}
