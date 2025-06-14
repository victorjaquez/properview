import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Update analytics when an inquiry is submitted
async function updateAnalyticsForInquiry(propertyId: string) {
  const today = new Date().toISOString().split('T')[0];
  const dateStart = new Date(today + 'T00:00:00.000Z');
  const dateEnd = new Date(today + 'T23:59:59.999Z');

  // Get today's data for this property
  const [totalViews, uniqueVisitorsData, inquiries] = await Promise.all([
    prisma.listingView.count({
      where: {
        propertyId,
        viewedAt: { gte: dateStart, lt: dateEnd },
      },
    }),
    prisma.listingView.groupBy({
      by: ['sessionId'],
      where: {
        propertyId,
        viewedAt: { gte: dateStart, lt: dateEnd },
      },
    }),
    prisma.inquiry.count({
      where: {
        propertyId,
        dateSubmitted: { gte: dateStart, lt: dateEnd },
      },
    }),
  ]);

  // Update property analytics
  await prisma.propertyAnalytics.upsert({
    where: { propertyId_date: { propertyId, date: today } },
    update: {
      views: totalViews,
      uniqueVisitors: uniqueVisitorsData.length,
      inquiries,
    },
    create: {
      propertyId,
      date: today,
      views: totalViews,
      uniqueVisitors: uniqueVisitorsData.length,
      inquiries,
    },
  });

  // Update global analytics
  const [globalViews, globalUniqueVisitorsData, globalInquiries] =
    await Promise.all([
      prisma.listingView.count({
        where: { viewedAt: { gte: dateStart, lt: dateEnd } },
      }),
      prisma.listingView.groupBy({
        by: ['sessionId'],
        where: { viewedAt: { gte: dateStart, lt: dateEnd } },
      }),
      prisma.inquiry.count({
        where: { dateSubmitted: { gte: dateStart, lt: dateEnd } },
      }),
    ]);

  await prisma.analyticsSummary.upsert({
    where: { date: today },
    update: {
      totalViews: globalViews,
      uniqueVisitors: globalUniqueVisitorsData.length,
      totalInquiries: globalInquiries,
    },
    create: {
      date: today,
      totalViews: globalViews,
      uniqueVisitors: globalUniqueVisitorsData.length,
      totalInquiries: globalInquiries,
    },
  });
}

// Get all inquiries with property details
export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// Submit new inquiry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        name,
        email,
        phone: phone || null,
        message,
        dateSubmitted: new Date().toISOString(),
      },
    });

    // Update analytics for the inquiry
    await updateAnalyticsForInquiry(propertyId);

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
