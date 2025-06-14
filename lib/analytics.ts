// Simple session ID for demo purposes
export function generateSessionId(): string {
  // For demo: just generate a simple random session ID
  return (
    'demo_session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  );
}

// Track a listing view
export async function trackListingView(propertyId: string): Promise<void> {
  try {
    if (typeof window === 'undefined') return; // Skip on server-side

    const sessionId = generateSessionId();

    await fetch('/api/analytics/track-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        sessionId,
      }),
    });
  } catch (error) {
    console.error('Failed to track listing view:', error);
  }
}

// Debounced tracking to avoid multiple calls
let trackingTimeout: NodeJS.Timeout | null = null;

export function trackListingViewDebounced(
  propertyId: string,
  delay: number = 2000
): void {
  if (trackingTimeout) {
    clearTimeout(trackingTimeout);
  }

  trackingTimeout = setTimeout(() => {
    trackListingView(propertyId);
  }, delay);
}

// Analytics data types
export interface AnalyticsSummary {
  totalViews: number;
  totalInquiries: number;
  totalSalesValue: number;
  viewsTrend: number;
  inquiriesTrend: number;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  inquiries: number;
  uniqueVisitors: number;
}

export interface TopProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  views: number;
  inquiries: number;
  uniqueVisitors: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  chartData: ChartDataPoint[];
  topProperties: TopProperty[];
  today: {
    views: number;
    inquiries: number;
    uniqueVisitors: number;
  };
}

// Fetch analytics data
export async function fetchAnalytics(): Promise<AnalyticsData> {
  try {
    const response = await fetch('/api/analytics/summary');
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    throw error;
  }
}

// Format numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format trend percentage
export function formatTrend(trend: number): string {
  const sign = trend > 0 ? '+' : '';
  return `${sign}${trend.toFixed(1)}%`;
}
