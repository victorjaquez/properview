'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Suspense } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { InquiriesProvider } from '@/providers/InquiriesProvider';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { agent, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !agent) {
      router.push('/login');
    }
  }, [isLoading, agent, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <InquiriesProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden bg-muted/40">
          <Navbar
            variant="dashboard"
            user={{ name: agent.name }}
            onLogout={handleLogout}
            onSettingsClick={handleSettingsClick}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-4 md:gap-8">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </SidebarProvider>
    </InquiriesProvider>
  );
}
