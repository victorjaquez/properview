'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  ListChecks,
  MessageCircle,
  BarChart2,
  Settings,
  LogOut,
  Mountain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useAuth } from '@/providers/AuthProvider';
import { useInquiriesContext } from '@/providers/InquiriesProvider';

interface NavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  className?: string;
  badgeCount?: number;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/listings', label: 'Listings', icon: ListChecks },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageCircle },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
];

const secondaryNavItems: NavItem[] = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  sidebarCollapsed: boolean;
}

function NavItem({ item, isActive, sidebarCollapsed }: NavItemProps) {
  const content = (
    <SidebarMenuButton
      asChild={!!item.href}
      onClick={item.onClick}
      isActive={isActive}
      className={cn('justify-start', item.className)}
    >
      {item.href ? (
        <Link href={item.href} prefetch={false}>
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
          {(item.badgeCount || 0) > 0 && (
            <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {(item.badgeCount || 0) > 99 ? '99+' : item.badgeCount}
            </span>
          )}
        </Link>
      ) : (
        <>
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
          {(item.badgeCount || 0) > 0 && (
            <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {(item.badgeCount || 0) > 99 ? '99+' : item.badgeCount}
            </span>
          )}
        </>
      )}
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" align="center" hidden={!sidebarCollapsed}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();

  const isCollapsed = sidebarState === 'collapsed';

  const { unreadInquiriesCount } = useInquiriesContext();

  // Dynamic navItems with badge count
  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/listings', label: 'Listings', icon: ListChecks },
    {
      href: '/dashboard/inquiries',
      label: 'Inquiries',
      icon: MessageCircle,
      badgeCount: unreadInquiriesCount,
    },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getIsActive = (item: NavItem) => {
    if (!item.href) return false;

    return (
      pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href))
    );
  };

  const logoutItem: NavItem = {
    label: 'Logout',
    icon: LogOut,
    onClick: handleLogout,
    className: 'text-muted-foreground hover:text-destructive',
  };

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="hidden border-r bg-background sm:flex"
      >
        <SidebarHeader className="p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-2"
            prefetch={false}
          >
            <Mountain className="h-7 w-7 text-primary" />
            <span
              className={cn(
                'text-lg font-semibold transition-opacity duration-200',
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              )}
            >
              ProperView
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={getIsActive(item)}
                    sidebarCollapsed={isCollapsed}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-2">
          <SidebarMenu>
            {secondaryNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={getIsActive(item)}
                sidebarCollapsed={isCollapsed}
              />
            ))}
            <NavItem
              item={logoutItem}
              isActive={false}
              sidebarCollapsed={isCollapsed}
            />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
