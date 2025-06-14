'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BedDouble,
  Bath,
  Ruler,
  CalendarDays,
  DollarSign,
  Eye,
  Share2,
} from 'lucide-react';
import type { Property } from '@/components/types';
import { usePropertyAnalytics } from '@/hooks/usePropertyAnalytics';
import { useShareCopy } from '@/hooks/useShareCopy';

interface ListingDetailsProps {
  listing: Property;
}

export function ListingDetails({ listing }: ListingDetailsProps) {
  const { analytics, isLoading: analyticsLoading } = usePropertyAnalytics(
    listing.id
  );
  const shareOrCopy = useShareCopy();

  const calculateDaysOnMarket = (dateListed: string) => {
    const listDate = new Date(dateListed);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - listDate.getTime());

    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePricePerSqft = (price: number, sqft?: number) => {
    if (!sqft) return 'N/A';

    return `$${Math.round(price / sqft)}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={
            listing.imageUrl ||
            '/placeholder.svg?width=400&height=400&query=property'
          }
          alt={`Main image of ${listing.title}`}
          width={400}
          height={400}
          className="aspect-video w-full object-cover sm:max-h-64 md:max-h-96"
        />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-xl font-bold">{listing.title}</h1>
            <p className="text-sm text-muted-foreground">{listing.address}</p>
            <p className="text-lg font-semibold text-primary">
              ${listing.price.toLocaleString()}
            </p>
          </div>
          <Badge
            variant={
              listing.status === 'active'
                ? 'default'
                : listing.status === 'pending'
                ? 'secondary'
                : 'outline'
            }
            className="text-sm px-3 py-1 self-start sm:self-center capitalize"
          >
            {listing.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-center border-t border-b py-2">
          {[
            {
              icon: <BedDouble className="h-5 w-5 mx-auto text-primary" />,
              label: 'Beds',
              value: listing.bedrooms,
            },
            {
              icon: <Bath className="h-5 w-5 mx-auto text-primary" />,
              label: 'Baths',
              value: listing.bathrooms,
            },
            {
              icon: <Ruler className="h-5 w-5 mx-auto text-primary" />,
              label: 'SqFt',
              value: listing.sqft ? listing.sqft.toLocaleString() : 'N/A',
            },
            {
              icon: <CalendarDays className="h-5 w-5 mx-auto text-primary" />,
              label: 'Listed',
              value: new Date(listing.dateListed).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
            },
            {
              icon: <DollarSign className="h-5 w-5 mx-auto text-primary" />,
              label: 'Price/SqFt',
              value: calculatePricePerSqft(listing.price, listing.sqft),
            },
          ].map((item) => (
            <div key={item.label} className="py-1">
              {item.icon}
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              <p className="font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-base font-semibold mb-1">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {listing.description}
            </p>
          </div>
          {listing.propertyType && (
            <div>
              <h2 className="text-base font-semibold mb-1">Property Type</h2>
              <p className="text-muted-foreground text-sm">
                {listing.propertyType}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-muted rounded-lg">
          <div className="text-center">
            <p className="font-semibold text-sm">
              {analyticsLoading ? '-' : analytics?.views || 0}
            </p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">
              {analyticsLoading ? '-' : analytics?.inquiries || 0}
            </p>
            <p className="text-xs text-muted-foreground">Inquiries</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">
              {calculateDaysOnMarket(listing.dateListed)}
            </p>
            <p className="text-xs text-muted-foreground">Days Listed</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-sm font-medium">
            Listed by: {listing.agent?.name || 'Unknown Agent'}
          </p>
          <p className="text-xs text-muted-foreground">
            Date Listed: {new Date(listing.dateListed).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/listings/${listing.id}`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" /> View Public Page
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const url = `${window.location.origin}/listings/${listing.id}`;

              await shareOrCopy({
                title: listing.title,
                text: `Check out this property: ${listing.title}`,
                url: url,
              });
            }}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share Listing
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
