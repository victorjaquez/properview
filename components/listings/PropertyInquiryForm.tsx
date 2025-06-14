import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, User, MessageSquareIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { formatPhoneNumber } from '@/lib/utils';

const inquiryFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{3}-\d{3}-\d{4}$/.test(val), {
      message: 'Phone number must be in format: 123-456-7890',
    }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

interface PropertyInquiryFormProps {
  propertyId: string;
  isSubmitting: boolean;
  onSubmit: (data: InquiryFormValues) => Promise<void>;
  successMessage?: string | null;
  errorMessage?: string | null;
}

export function PropertyInquiryForm({
  propertyId,
  isSubmitting,
  onSubmit,
  successMessage,
  errorMessage,
}: PropertyInquiryFormProps) {
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const handleSubmit = async (data: InquiryFormValues) => {
    await onSubmit(data);
    if (successMessage) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <MessageSquareIcon className="mr-2 h-6 w-6 text-primary" />
          Inquire About This Property
        </CardTitle>
        <CardDescription>
          Fill out the form below and an agent will contact you shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        className="pl-8"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-8"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="123-456-7890"
                        className="pl-8"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="message">Message</Label>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="I'd like to know more about..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </Button>
            {successMessage && (
              <p className="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded-md">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded-md">
                {errorMessage}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
