import { useEffect, useState, useMemo } from 'react';
import type { Property } from '@/components/types';

interface UsePropertyFiltersProps {
  properties: Property[];
}

interface UsePropertyFiltersReturn {
  filteredProperties: Property[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bedrooms: string;
  setBedrooms: (bedrooms: string) => void;
  location: string;
  setLocation: (location: string) => void;
  minMaxPrice: [number, number];
}

export function usePropertyFilters({
  properties,
}: UsePropertyFiltersProps): UsePropertyFiltersReturn {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [location, setLocation] = useState<string>('');

  const minMaxPrice = useMemo(() => {
    if (properties.length === 0) return [0, 2000000] as [number, number];
    const prices = properties.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [properties]);

  // Initialize price range when properties are loaded
  useEffect(() => {
    if (properties.length > 0) {
      setPriceRange([minMaxPrice[0], minMaxPrice[1]]);
    }
  }, [properties, minMaxPrice]);

  // Apply filters whenever filter values or properties change
  useEffect(() => {
    let tempFiltered = properties;

    // Price filter
    tempFiltered = tempFiltered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Bedrooms filter
    if (bedrooms !== 'any') {
      const numBeds = Number.parseInt(bedrooms);
      if (bedrooms.endsWith('+')) {
        tempFiltered = tempFiltered.filter((p) => p.bedrooms >= numBeds);
      } else {
        tempFiltered = tempFiltered.filter((p) => p.bedrooms === numBeds);
      }
    }

    // Location filter (simple text search on address or title)
    if (location.trim() !== '') {
      tempFiltered = tempFiltered.filter(
        (p) =>
          p.address.toLowerCase().includes(location.toLowerCase()) ||
          p.title.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredProperties(tempFiltered);
  }, [priceRange, bedrooms, location, properties]);

  return {
    filteredProperties,
    priceRange,
    setPriceRange,
    bedrooms,
    setBedrooms,
    location,
    setLocation,
    minMaxPrice,
  };
}
