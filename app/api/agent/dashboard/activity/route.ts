import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatTimeAgo } from '@/lib/dateUtils';
import { MOCK_AGENT_ID } from '@/lib/constants';

// Get recent activity feed for the current agent
export async function GET() {
  try {
    const activities: any[] = [];

    // Fetch recent listings for this agent
    const recentListings = await prisma.property.findMany({
      where: { agentId: MOCK_AGENT_ID },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        address: true,
        createdAt: true,
        status: true,
      },
    });

    // Fetch recent inquiries for this agent's properties
    const recentInquiries = await prisma.inquiry.findMany({
      where: {
        property: {
          agentId: MOCK_AGENT_ID,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    // Fetch recent property updates for this agent
    const recentUpdates = await prisma.property.findMany({
      where: {
        agentId: MOCK_AGENT_ID,
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
        NOT: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Exclude newly created
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        address: true,
        status: true,
        price: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // Convert listings to activity items
    recentListings.forEach((listing) => {
      activities.push({
        id: `listing-${listing.id}`,
        type: 'listing' as const,
        description: `${listing.title} was listed`,
        time: formatTimeAgo(listing.createdAt),
        timestamp: listing.createdAt,
        propertyId: listing.id,
        propertyTitle: listing.title,
      });
    });

    // Convert inquiries to activity items
    recentInquiries.forEach((inquiry) => {
      activities.push({
        id: `inquiry-${inquiry.id}`,
        type: 'inquiry' as const,
        description: `New inquiry for ${inquiry.property.title}`,
        time: formatTimeAgo(inquiry.createdAt),
        timestamp: inquiry.createdAt,
        propertyId: inquiry.property.id,
        propertyTitle: inquiry.property.title,
      });
    });

    // Convert updates to activity items
    recentUpdates.forEach((update) => {
      const isStatusChange = true; // Simplified - in reality we'd track what changed
      const isPriceChange = false; // You could add price change tracking

      if (isStatusChange) {
        activities.push({
          id: `status-${update.id}-${update.updatedAt.getTime()}`,
          type: 'status_change' as const,
          description: `${update.title} status changed to ${update.status}`,
          time: formatTimeAgo(update.updatedAt),
          timestamp: update.updatedAt,
          propertyId: update.id,
          propertyTitle: update.title,
        });
      }

      if (isPriceChange) {
        activities.push({
          id: `price-${update.id}-${update.updatedAt.getTime()}`,
          type: 'price_update' as const,
          description: `${
            update.title
          } price updated to $${update.price.toLocaleString()}`,
          time: formatTimeAgo(update.updatedAt),
          timestamp: update.updatedAt,
          propertyId: update.id,
          propertyTitle: update.title,
        });
      }
    });

    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const limitedActivities = activities.slice(0, 10);

    return NextResponse.json(limitedActivities);
  } catch (error) {
    console.error('Agent dashboard activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    );
  }
}
