import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/components/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/listings/${property.id}`} className="block">
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0 relative">
          <Image
            src={
              property.imageUrl ||
              '/placeholder.svg?width=400&height=250&query=property'
            }
            alt={property.title}
            width={400}
            height={250}
            className="aspect-video w-full object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 space-y-1 flex-grow">
          <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
            {property.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground truncate">
            {property.address}
          </p>
          <p className="text-2xl font-semibold text-primary pt-1">
            ${property.price.toLocaleString()}
          </p>
          <div className="flex items-center text-sm text-muted-foreground space-x-2 pt-1">
            <span>{property.bedrooms} Beds</span>
            <span>&bull;</span>
            <span>{property.bathrooms} Baths</span>
            {property.sqft && (
              <>
                <span>&bull;</span>
                <span>{property.sqft} sqft</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
