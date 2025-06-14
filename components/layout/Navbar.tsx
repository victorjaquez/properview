'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mountain, Moon, Sun, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  variant?: 'landing' | 'public' | 'dashboard';
  user?: {
    name: string;
  };
  onLogout?: () => void;
  onSettingsClick?: () => void;
}

export function Navbar({
  variant,
  user,
  onLogout,
  onSettingsClick,
}: NavbarProps = {}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const actualVariant = variant || (pathname === '/' ? 'landing' : 'public');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={`flex items-center sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${
        actualVariant === 'dashboard'
          ? 'px-4 sm:px-6 h-14'
          : 'px-3 sm:px-4 lg:px-6 h-16'
      }`}
    >
      {actualVariant === 'dashboard' && (
        <SidebarTrigger className="sm:hidden" />
      )}

      {actualVariant !== 'dashboard' && (
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Mountain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="ml-2 text-lg sm:text-xl font-semibold">
            ProperView
          </span>
        </Link>
      )}

      <nav className="ml-auto flex items-center gap-2 sm:gap-4 lg:gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={
            actualVariant === 'dashboard' ? 'h-8 w-8 px-0' : 'h-9 w-9 px-0'
          }
          suppressHydrationWarning
        >
          {mounted && theme === 'dark' ? (
            <Sun
              className={
                actualVariant === 'dashboard'
                  ? 'h-[1.1rem] w-[1.1rem]'
                  : 'h-[1.2rem] w-[1.2rem]'
              }
            />
          ) : (
            <Moon
              className={
                actualVariant === 'dashboard'
                  ? 'h-[1.1rem] w-[1.1rem]'
                  : 'h-[1.2rem] w-[1.2rem]'
              }
            />
          )}
        </Button>

        {actualVariant === 'dashboard' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-8 w-8 rounded-full bg-primary"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary">
                    <User className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSettingsClick}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : actualVariant === 'landing' ? (
          <>
            {/* Landing page navigation */}
            <Link
              href="#features"
              className="hidden md:flex text-sm font-medium hover:underline underline-offset-4 items-center h-10"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hidden md:flex text-sm font-medium hover:underline underline-offset-4 items-center h-10"
              prefetch={false}
            >
              Pricing
            </Link>
            <Link
              href="/listings"
              className="text-sm font-medium"
              prefetch={false}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs sm:text-sm px-2 sm:px-4 flex items-center justify-center"
              >
                <span className="hidden sm:inline">Browse Listings</span>
                <span className="sm:hidden">All Listings</span>
              </Button>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium"
              prefetch={false}
            >
              <Button
                size="sm"
                className="h-9 text-xs sm:text-sm px-2 sm:px-4 flex items-center justify-center"
              >
                <span className="hidden sm:inline">Agent Login</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Public pages navigation */}
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center h-9"
              prefetch={false}
            >
              Home
            </Link>
            {!isLoginPage && (
              <Link
                href="/login"
                className="text-sm font-medium"
                prefetch={false}
              >
                <Button
                  size="sm"
                  className="h-9 text-xs sm:text-sm px-2 sm:px-4 flex items-center justify-center"
                >
                  Agent Login
                </Button>
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
