import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <Card className="text-center p-8">
      <CardTitle>No Listings Yet</CardTitle>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          You haven't added any properties. Get started by adding your first
          listing!
        </p>
        <Link href="/dashboard/listings/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
