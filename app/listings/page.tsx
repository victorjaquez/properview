'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PropertyCard } from '@/components/listings/PropertyCard';
import { PropertyCardSkeleton } from '@/components/listings/PropertyCardSkeleton';
import { PropertyFilters } from '@/components/listings/PropertyFilters';
import { useProperties } from '@/hooks/useProperties';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';

export default function PublicListingsPage() {
  const { properties, isLoading, error } = useProperties();
  const {
    filteredProperties,
    priceRange,
    setPriceRange,
    bedrooms,
    setBedrooms,
    location,
    setLocation,
    minMaxPrice,
  } = usePropertyFilters({ properties });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Find Your Dream Property
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse our curated list of available properties.
          </p>
        </div>

        <PropertyFilters
          location={location}
          onLocationChange={setLocation}
          bedrooms={bedrooms}
          onBedroomsChange={setBedrooms}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          minMaxPrice={minMaxPrice}
          isLoading={isLoading}
          hasListings={properties.length > 0}
        />

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {!isLoading && !error && filteredProperties.length === 0 && (
          <p className="text-muted-foreground text-center py-10">
            No properties match your current filters.
          </p>
        )}

        {!isLoading && !error && filteredProperties.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
      <footer className="text-center p-4 border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ProperView. All rights reserved.
      </footer>
    </div>
  );
}
