export interface FieldConfig {
  name:
    | 'title'
    | 'price'
    | 'address'
    | 'bedrooms'
    | 'bathrooms'
    | 'description'
    | 'status'
    | 'sqft'
    | 'propertyType';
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  description?: string;
  className?: string;
  step?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

export const FIELD_CONFIGS: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    placeholder: 'e.g., Beautiful Family Home',
    className: 'md:col-span-3',
  },
  {
    name: 'address',
    label: 'Address',
    placeholder: 'e.g., 123 Main St, Anytown, USA',
    className: 'md:col-span-3',
  },
  {
    name: 'price',
    label: 'Price (USD)',
    type: 'number',
    placeholder: 'e.g., 550000',
  },
  {
    name: 'bedrooms',
    label: 'Bedrooms',
    type: 'number',
    placeholder: 'e.g., 3',
  },
  {
    name: 'bathrooms',
    label: 'Bathrooms',
    type: 'number',
    placeholder: 'e.g., 2.5',
    step: '0.5',
  },
  {
    name: 'sqft',
    label: 'Square Footage (Optional)',
    type: 'number',
    placeholder: 'e.g., 1800',
  },
  {
    name: 'propertyType',
    label: 'Property Type (Optional)',
    placeholder: 'e.g., Single Family',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'sold', label: 'Sold' },
    ],
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe the property...',
    rows: 3,
    className: 'md:col-span-3',
  },
];
