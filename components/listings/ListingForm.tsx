'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { FIELD_CONFIGS, type FieldConfig } from './forms/ListingFormConfig';

const propertyFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  price: z.coerce
    .number()
    .positive({ message: 'Price must be a positive number.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  bedrooms: z.coerce
    .number()
    .int()
    .min(0, { message: 'Bedrooms must be 0 or more.' }),
  bathrooms: z.coerce
    .number()
    .min(0, { message: 'Bathrooms must be 0 or more.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  status: z.enum(['active', 'pending', 'sold']),
  sqft: z.coerce
    .number()
    .int()
    .min(0, { message: 'SqFt must be 0 or more.' })
    .optional(),
  propertyType: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface ListingFormProps {
  initialData?: Property | null;
  onSubmitForm: (data: PropertyFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const getDefaultValues = (
  initialData?: Property | null
): PropertyFormValues => ({
  title: initialData?.title || '',
  price: initialData?.price || 0,
  address: initialData?.address || '',
  bedrooms: initialData?.bedrooms || 0,
  bathrooms: initialData?.bathrooms || 0,
  description: initialData?.description || '',
  status: initialData?.status || 'active',
  sqft: initialData?.sqft || undefined,
  propertyType: initialData?.propertyType || undefined,
});

export function ListingForm({
  initialData,
  onSubmitForm,
  isSubmitting,
}: ListingFormProps) {
  const router = useRouter();
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const handleFormSubmit = async (data: PropertyFormValues) => {
    const cleanedData = {
      ...data,
      sqft: data.sqft || undefined,
      propertyType: data.propertyType?.trim() || undefined,
    };
    await onSubmitForm(cleanedData);
  };

  const renderField = (config: FieldConfig) => (
    <FormField
      key={config.name}
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            {config.type === 'textarea' ? (
              <Textarea
                placeholder={config.placeholder}
                rows={config.rows}
                {...field}
              />
            ) : config.type === 'select' ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value || '')}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${config.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {config.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={config.type || 'text'}
                placeholder={config.placeholder}
                step={config.step}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={String(field.value || '')}
              />
            )}
          </FormControl>
          {config.description && (
            <FormDescription>{config.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const isEditing = !!initialData;

  const submitButtonText = isSubmitting
    ? isEditing
      ? 'Saving...'
      : 'Creating...'
    : isEditing
    ? 'Save Changes'
    : 'Create Listing';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </CardTitle>
            <CardDescription className="text-sm">
              {isEditing
                ? 'Update the details for this listing.'
                : 'Enter the details for your new listing.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FIELD_CONFIGS.map(renderField)}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
