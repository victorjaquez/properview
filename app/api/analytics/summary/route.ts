import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_AGENT_ID } from '@/lib/constants';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Get today's totals
    const [todayViews, todayInquiries, todayUniqueVisitors] = await Promise.all(
      [
        prisma.listingView.count({
          where: {
            viewedAt: {
              gte: new Date(today + 'T00:00:00.000Z'),
              lt: new Date(today + 'T23:59:59.999Z'),
            },
          },
        }),
        prisma.inquiry.count({
          where: {
            dateSubmitted: {
              gte: new Date(today + 'T00:00:00.000Z'),
              lt: new Date(today + 'T23:59:59.999Z'),
            },
          },
        }),
        prisma.listingView
          .groupBy({
            by: ['sessionId'],
            where: {
              viewedAt: {
                gte: new Date(today + 'T00:00:00.000Z'),
                lt: new Date(today + 'T23:59:59.999Z'),
              },
            },
          })
          .then((result) => result.length),
      ]
    );

    // Get last 30 days for trend calculation
    const thirtyDaysData = await prisma.analyticsSummary.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate total views (last 30 days)
    const totalViews = thirtyDaysData.reduce(
      (sum, day) => sum + day.totalViews,
      0
    );

    // Calculate total inquiries (last 30 days)
    const totalInquiries = thirtyDaysData.reduce(
      (sum, day) => sum + day.totalInquiries,
      0
    );

    // Calculate sales value (mock data for now)
    const totalSalesValue = 6700000; // $6.7M placeholder

    // Calculate trends (compare last 7 days to previous 7 days)
    const last7Days = thirtyDaysData.slice(0, 7);
    const previous7Days = thirtyDaysData.slice(7, 14);

    const last7DaysViews = last7Days.reduce(
      (sum, day) => sum + day.totalViews,
      0
    );
    const previous7DaysViews = previous7Days.reduce(
      (sum, day) => sum + day.totalViews,
      0
    );
    const viewsTrend =
      previous7DaysViews > 0
        ? ((last7DaysViews - previous7DaysViews) / previous7DaysViews) * 100
        : 0;

    const last7DaysInquiries = last7Days.reduce(
      (sum, day) => sum + day.totalInquiries,
      0
    );
    const previous7DaysInquiries = previous7Days.reduce(
      (sum, day) => sum + day.totalInquiries,
      0
    );
    const inquiriesTrend =
      previous7DaysInquiries > 0
        ? ((last7DaysInquiries - previous7DaysInquiries) /
            previous7DaysInquiries) *
          100
        : 0;

    // Get chart data for the last 30 days
    const chartData = thirtyDaysData.reverse().map((day) => ({
      date: day.date,
      views: day.totalViews,
      inquiries: day.totalInquiries,
      uniqueVisitors: day.uniqueVisitors,
    }));

    // Get agent's property IDs first
    const agentProperties = await prisma.property.findMany({
      where: { agentId: MOCK_AGENT_ID },
      select: { id: true },
    });
    const agentPropertyIds = agentProperties.map((p) => p.id);

    // Get top performing properties (all-time, real-time data from raw tables)
    const topPropertiesData = await Promise.all(
      agentPropertyIds.map(async (propertyId) => {
        const [property, views, inquiries, uniqueVisitors] = await Promise.all([
          prisma.property.findUnique({
            where: { id: propertyId },
            select: { id: true, title: true, address: true, price: true },
          }),
          prisma.listingView.count({
            where: { propertyId },
          }),
          prisma.inquiry.count({
            where: { propertyId },
          }),
          prisma.listingView
            .findMany({
              where: { propertyId },
              select: { sessionId: true },
              distinct: ['sessionId'],
            })
            .then((sessions) => sessions.length),
        ]);

        if (!property) return null;

        return {
          ...property,
          views,
          inquiries,
          uniqueVisitors,
        };
      })
    );

    // Filter out null entries and sort by views
    const topPropertiesWithDetails = topPropertiesData
      .filter(
        (property): property is NonNullable<typeof property> =>
          property !== null
      )
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalViews,
        totalInquiries,
        totalSalesValue,
        viewsTrend: Math.round(viewsTrend * 100) / 100,
        inquiriesTrend: Math.round(inquiriesTrend * 100) / 100,
      },
      chartData,
      topProperties: topPropertiesWithDetails,
      today: {
        views: todayViews,
        inquiries: todayInquiries,
        uniqueVisitors: todayUniqueVisitors,
      },
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
