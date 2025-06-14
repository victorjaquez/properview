'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Inquiry } from '@/components/types';

interface InquiriesContextType {
  inquiries: Inquiry[];
  unreadInquiriesCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (inquiryId: string) => Promise<void>;
  markAsUnread: (inquiryId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const InquiriesContext = createContext<InquiriesContextType | undefined>(
  undefined
);

export function InquiriesProvider({ children }: { children: React.ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }
      const data: Inquiry[] = await response.json();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const markAsRead = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark inquiry as read');
      }

      // Update local state
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, isRead: true } : inquiry
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const markAsUnread = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark inquiry as unread');
      }

      // Update local state
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, isRead: false } : inquiry
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const unreadInquiriesCount = inquiries.filter(
    (inquiry) => !inquiry.isRead
  ).length;

  const value: InquiriesContextType = {
    inquiries,
    unreadInquiriesCount,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    refetch: fetchInquiries,
  };

  return (
    <InquiriesContext.Provider value={value}>
      {children}
    </InquiriesContext.Provider>
  );
}

export function useInquiriesContext() {
  const context = useContext(InquiriesContext);
  if (context === undefined) {
    throw new Error(
      'useInquiriesContext must be used within an InquiriesProvider'
    );
  }
  return context;
}
