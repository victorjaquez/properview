import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, sessionId } = body;

    if (!propertyId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing propertyId or sessionId' },
        { status: 400 }
      );
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';
    const referrer = request.headers.get('referer') || '';

    // Check if this session already viewed this property today
    const today = new Date().toISOString().split('T')[0];
    const existingView = await prisma.listingView.findFirst({
      where: {
        propertyId,
        sessionId,
        viewedAt: {
          gte: new Date(today + 'T00:00:00.000Z'),
          lt: new Date(today + 'T23:59:59.999Z'),
        },
      },
    });

    // If already viewed today by this session, don't create duplicate
    if (existingView) {
      return NextResponse.json({ message: 'View already tracked today' });
    }

    // Create the listing view record
    await prisma.listingView.create({
      data: {
        propertyId,
        sessionId,
        userAgent,
        ipAddress,
        referrer,
      },
    });

    // Update daily analytics
    await updateDailyAnalytics(propertyId, today);

    return NextResponse.json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error('Failed to track view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}

async function updateDailyAnalytics(propertyId: string, date: string) {
  const dateStart = new Date(date + 'T00:00:00.000Z');
  const dateEnd = new Date(date + 'T23:59:59.999Z');

  // Get today's unique visitors for this property
  const uniqueVisitorsData = await prisma.listingView.groupBy({
    by: ['sessionId'],
    where: {
      propertyId,
      viewedAt: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  // Get today's total views for this property
  const totalViews = await prisma.listingView.count({
    where: {
      propertyId,
      viewedAt: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  // Get today's inquiries for this property
  const inquiries = await prisma.inquiry.count({
    where: {
      propertyId,
      dateSubmitted: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  // Upsert property analytics
  await prisma.propertyAnalytics.upsert({
    where: {
      propertyId_date: {
        propertyId,
        date,
      },
    },
    update: {
      views: totalViews,
      uniqueVisitors: uniqueVisitorsData.length,
      inquiries,
    },
    create: {
      propertyId,
      date,
      views: totalViews,
      uniqueVisitors: uniqueVisitorsData.length,
      inquiries,
    },
  });

  // Update global analytics summary
  const globalViews = await prisma.listingView.count({
    where: {
      viewedAt: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  const globalUniqueVisitorsData = await prisma.listingView.groupBy({
    by: ['sessionId'],
    where: {
      viewedAt: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  const globalInquiries = await prisma.inquiry.count({
    where: {
      dateSubmitted: {
        gte: dateStart,
        lt: dateEnd,
      },
    },
  });

  await prisma.analyticsSummary.upsert({
    where: { date },
    update: {
      totalViews: globalViews,
      uniqueVisitors: globalUniqueVisitorsData.length,
      totalInquiries: globalInquiries,
    },
    create: {
      date,
      totalViews: globalViews,
      uniqueVisitors: globalUniqueVisitorsData.length,
      totalInquiries: globalInquiries,
    },
  });
}
