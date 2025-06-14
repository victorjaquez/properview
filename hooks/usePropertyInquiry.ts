import { useState } from 'react';

interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface UsePropertyInquiryReturn {
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  submitInquiry: (data: InquiryData, propertyId: string) => Promise<void>;
}

export function usePropertyInquiry(): UsePropertyInquiryReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitInquiry = async (data: InquiryData, propertyId: string) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, propertyId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit inquiry.');
      }

      setSuccessMessage(
        'Your inquiry has been sent successfully! The agent will contact you shortly.'
      );
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    successMessage,
    errorMessage,
    submitInquiry,
  };
}
