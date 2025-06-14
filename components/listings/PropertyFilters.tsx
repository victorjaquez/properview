import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface PropertyFiltersProps {
  location: string;
  onLocationChange: (location: string) => void;
  bedrooms: string;
  onBedroomsChange: (bedrooms: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minMaxPrice: [number, number];
  isLoading: boolean;
  hasListings: boolean;
}

export function PropertyFilters({
  location,
  onLocationChange,
  bedrooms,
  onBedroomsChange,
  priceRange,
  onPriceRangeChange,
  minMaxPrice,
  isLoading,
  hasListings,
}: PropertyFiltersProps) {
  return (
    <Card className="mb-8 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Search by address or title..."
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select value={bedrooms} onValueChange={onBedroomsChange}>
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5+">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label>
            Price Range: ${priceRange[0].toLocaleString()} - $
            {priceRange[1].toLocaleString()}
          </Label>
          <Slider
            min={1000000 || minMaxPrice[0]}
            max={minMaxPrice[1]}
            step={10000}
            value={priceRange}
            onValueChange={(value) =>
              onPriceRangeChange([value[0]!, value[1]!] as [number, number])
            }
            disabled={isLoading || !hasListings}
            className="mt-2"
          />
        </div>
      </div>
    </Card>
  );
}
