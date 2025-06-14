import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Property } from '@/components/types';

interface ListingCardProps {
  listing: Property;
  onDelete: (id: string) => void;
}

export function ListingCard({ listing, onDelete }: ListingCardProps) {
  return (
    <Link href={`/dashboard/listings/${listing.id}`} className="block">
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0 relative">
          <Image
            src={
              listing.imageUrl ||
              '/placeholder.svg?width=400&height=250&query=property'
            }
            alt={`Image of ${listing.address}`}
            width={400}
            height={250}
            className="aspect-[16/10] w-full object-cover"
          />
          <Badge
            variant={
              listing.status === 'active'
                ? 'default'
                : listing.status === 'pending'
                ? 'secondary'
                : 'outline'
            }
            className="absolute top-2 left-2 capitalize"
          >
            {listing.status}
          </Badge>
          <div className="absolute top-1.5 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2.5 py-0.5 text-xs font-semibold border rounded-full bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.preventDefault()}
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <Link href={`/dashboard/listings/${listing.id}/edit`} passHref>
                  <DropdownMenuItem>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(listing.id);
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2 flex-grow">
          <CardTitle className="text-lg leading-tight">
            {listing.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground truncate">
            {listing.address}
          </p>
          <p className="text-2xl font-semibold text-primary">
            ${listing.price.toLocaleString()}
          </p>
          <div className="flex items-center text-sm text-muted-foreground space-x-3">
            <span>{listing.bedrooms} Beds</span>
            <span>&bull;</span>
            <span>{listing.bathrooms} Baths</span>
            {listing.sqft && (
              <>
                <span>&bull;</span>
                <span>{listing.sqft} sqft</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Listed: {new Date(listing.dateListed).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
