import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get dashboard statistics
export async function GET() {
  try {
    // Date ranges for time-based queries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // Basic property counts
    const totalListings = await prisma.property.count();
    const activeListings = await prisma.property.count({
      where: { status: 'active' },
    });
    const pendingListings = await prisma.property.count({
      where: { status: 'pending' },
    });

    // Monthly sales data
    const soldThisMonth = await prisma.property.count({
      where: {
        status: 'sold',
        updatedAt: { gte: startOfMonth },
      },
    });

    // Calculate total sales value
    const soldProperties = await prisma.property.findMany({
      where: {
        status: 'sold',
        updatedAt: { gte: startOfMonth },
      },
      select: { price: true },
    });
    const totalValueSold = soldProperties.reduce(
      (sum, property) => sum + property.price,
      0
    );

    // Monthly inquiry count
    const newInquiries = await prisma.inquiry.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    // Mock views data (TODO: implement real tracking)
    const averageViews = Math.floor(Math.random() * 200) + 150; // Mock data: 150-350

    // Calculate conversion metrics
    const conversionRate =
      activeListings > 0
        ? Math.round((newInquiries / activeListings) * 100 * 100) / 100
        : 0;

    // Average time on market calculation
    const soldPropertiesWithDates = await prisma.property.findMany({
      where: { status: 'sold' },
      select: {
        dateListed: true,
        updatedAt: true,
      },
    });

    let averageTimeOnMarket = 45; // Default fallback
    if (soldPropertiesWithDates.length > 0) {
      const totalDays = soldPropertiesWithDates.reduce((sum, property) => {
        const listedDate = new Date(property.dateListed);
        const soldDate = property.updatedAt;
        const daysDiff = Math.floor(
          (soldDate.getTime() - listedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + daysDiff;
      }, 0);
      averageTimeOnMarket = Math.round(
        totalDays / soldPropertiesWithDates.length
      );
    }

    const stats = {
      totalListings,
      activeListings,
      pendingListings,
      soldThisMonth,
      totalValueSold,
      newInquiries,
      averageViews,
      conversionRate,
      averageTimeOnMarket,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
