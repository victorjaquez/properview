import { Home, MessageSquare, DollarSign, Settings } from 'lucide-react';
import type { ActivityItem } from '@/hooks/useRecentActivity';

export const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'listing':
      return <Home className="h-6 w-6 text-primary" />;
    case 'inquiry':
      return <MessageSquare className="h-6 w-6 text-blue-500" />;
    case 'price_update':
      return <DollarSign className="h-6 w-6 text-green-500" />;
    case 'status_change':
      return <Settings className="h-6 w-6 text-orange-500" />;
    default:
      return <Home className="h-6 w-6 text-gray-500" />;
  }
};

export const formatActivityType = (type: ActivityItem['type']): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
};
