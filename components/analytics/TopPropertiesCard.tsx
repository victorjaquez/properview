import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/analytics';
import Link from 'next/link';

interface TopPropertiesCardProps {
  topProperties: any[];
}

export function TopPropertiesCard({ topProperties }: TopPropertiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Your Performing Properties
        </CardTitle>
        <CardDescription>
          Properties with the most views of all time.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px] overflow-y-auto">
        {topProperties.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {topProperties.slice(0, 5).map((property, index) => (
              <Link
                key={property.id || index}
                href={`/dashboard/listings/${property.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {property.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {property.address}
                        </p>
                        <p className="text-[10px] sm:text-xs font-medium">
                          {formatCurrency(property.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 text-[10px] sm:text-xs text-muted-foreground">
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {property.views}
                      </p>
                      <p>views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {property.inquiries}
                      </p>
                      <p>inquiries</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm sm:text-base">
                No data available yet
              </p>
              <p className="text-xs text-muted-foreground">
                Views will appear as visitors browse listings
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
