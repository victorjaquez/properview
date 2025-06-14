import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { BedDouble, Bath, Ruler, CalendarDays } from 'lucide-react';
import type { Property } from '@/components/types';

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={
          property.imageUrl ||
          '/placeholder.svg?width=400&height=400&query=property+main'
        }
        alt={property.title}
        width={400}
        height={400}
        className="aspect-video w-full object-cover sm:max-h-64 md:max-h-96"
        priority
      />
      <CardContent className="p-4 space-y-3">
        <div>
          <h1 className="text-xl font-bold mb-1">{property.title}</h1>
          <p className="text-sm text-muted-foreground mb-2">
            {property.address}
          </p>
          <p className="text-lg font-semibold text-primary">
            ${property.price.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center border-t border-b py-2">
          {[
            {
              icon: <BedDouble className="h-5 w-5 mx-auto text-primary" />,
              label: 'Beds',
              value: property.bedrooms,
            },
            {
              icon: <Bath className="h-5 w-5 mx-auto text-primary" />,
              label: 'Baths',
              value: property.bathrooms,
            },
            {
              icon: <Ruler className="h-5 w-5 mx-auto text-primary" />,
              label: 'SqFt',
              value: property.sqft ? property.sqft.toLocaleString() : 'N/A',
            },
            {
              icon: <CalendarDays className="h-5 w-5 mx-auto text-primary" />,
              label: 'Listed',
              value: new Date(property.dateListed).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
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
            <h2 className="text-base font-semibold mb-1">
              About this property
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {property.description}
            </p>
          </div>
          {property.propertyType && (
            <div>
              <h2 className="text-base font-semibold mb-1">Property Type</h2>
              <p className="text-muted-foreground text-sm">
                {property.propertyType}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
