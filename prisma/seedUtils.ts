import { PrismaClient } from '@prisma/client';

export interface Property {
  id: string;
  [key: string]: any;
}

export async function generateListingViews(
  prisma: PrismaClient,
  properties: Property[],
  daysBack: number = 30
) {
  console.log('Creating analytics data...');

  const viewsToCreate = [];
  const sessionsPool = createSessionPool(50);

  // Generate views for specified number of days back
  for (let dayOffset = 0; dayOffset < daysBack; dayOffset++) {
    const viewDate = new Date();
    viewDate.setDate(viewDate.getDate() - dayOffset);

    // Each day has 5-50 views across different properties
    const viewsPerDay = Math.floor(Math.random() * 45) + 5;

    for (let viewIndex = 0; viewIndex < viewsPerDay; viewIndex++) {
      const randomProperty =
        properties[Math.floor(Math.random() * properties.length)];
      const randomSession =
        sessionsPool[Math.floor(Math.random() * sessionsPool.length)];

      // Random time within the day
      const viewDateTime = new Date(viewDate);
      viewDateTime.setHours(Math.floor(Math.random() * 24));
      viewDateTime.setMinutes(Math.floor(Math.random() * 60));

      viewsToCreate.push({
        propertyId: randomProperty.id,
        sessionId: randomSession,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        referrer: Math.random() > 0.7 ? 'https://google.com' : '',
        viewedAt: viewDateTime,
      });
    }
  }

  await prisma.listingView.createMany({
    data: viewsToCreate,
  });

  console.log(`Created ${viewsToCreate.length} listing views`);
  return viewsToCreate.length;
}

export function createSessionPool(count: number): string[] {
  const sessionsPool = [];
  for (let i = 0; i < count; i++) {
    sessionsPool.push(
      `demo_session_${Math.random().toString(36).substring(2)}_${
        Date.now() + i
      }`
    );
  }
  return sessionsPool;
}

export async function generateDailyAnalytics(
  prisma: PrismaClient,
  properties: Property[],
  daysBack: number = 30
) {
  const analyticsToCreate = [];
  const propertyAnalyticsToCreate = [];

  for (let dayOffset = 0; dayOffset < daysBack; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    const dayStart = new Date(dateStr + 'T00:00:00.000Z');
    const dayEnd = new Date(dateStr + 'T23:59:59.999Z');

    // Get actual counts for this day
    const [dayViews, dayUniqueVisitors, dayInquiries] = await Promise.all([
      prisma.listingView.count({
        where: { viewedAt: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.listingView
        .findMany({
          where: { viewedAt: { gte: dayStart, lte: dayEnd } },
          select: { sessionId: true },
          distinct: ['sessionId'],
        })
        .then((sessions) => sessions.length),
      prisma.inquiry.count({
        where: { dateSubmitted: { gte: dayStart, lte: dayEnd } },
      }),
    ]);

    // Create analytics summary for this day
    analyticsToCreate.push({
      date: dateStr,
      totalViews: dayViews,
      uniqueVisitors: dayUniqueVisitors,
      totalInquiries: dayInquiries,
    });

    // Create property analytics for properties with activity
    const propertyAnalytics = await generatePropertyAnalyticsForDay(
      prisma,
      properties,
      dateStr,
      dayStart,
      dayEnd
    );
    propertyAnalyticsToCreate.push(...propertyAnalytics);
  }

  // Batch create analytics summaries
  await prisma.analyticsSummary.createMany({
    data: analyticsToCreate,
  });

  await prisma.propertyAnalytics.createMany({
    data: propertyAnalyticsToCreate,
  });

  console.log(`Created ${analyticsToCreate.length} daily analytics summaries`);
  console.log(
    `Created ${propertyAnalyticsToCreate.length} property analytics records`
  );
}

async function generatePropertyAnalyticsForDay(
  prisma: PrismaClient,
  properties: Property[],
  dateStr: string,
  dayStart: Date,
  dayEnd: Date
) {
  const propertyAnalytics = [];

  for (const property of properties) {
    const [propViews, propUniqueVisitors, propInquiries] = await Promise.all([
      prisma.listingView.count({
        where: {
          propertyId: property.id,
          viewedAt: { gte: dayStart, lte: dayEnd },
        },
      }),
      prisma.listingView
        .findMany({
          where: {
            propertyId: property.id,
            viewedAt: { gte: dayStart, lte: dayEnd },
          },
          select: { sessionId: true },
          distinct: ['sessionId'],
        })
        .then((sessions) => sessions.length),
      prisma.inquiry.count({
        where: {
          propertyId: property.id,
          dateSubmitted: { gte: dayStart, lte: dayEnd },
        },
      }),
    ]);

    if (propViews > 0 || propInquiries > 0) {
      propertyAnalytics.push({
        propertyId: property.id,
        date: dateStr,
        views: propViews,
        uniqueVisitors: propUniqueVisitors,
        inquiries: propInquiries,
      });
    }
  }

  return propertyAnalytics;
}

export async function clearAnalyticsData(prisma: PrismaClient) {
  console.log('Clearing existing analytics data...');

  await prisma.listingView.deleteMany();
  await prisma.propertyAnalytics.deleteMany();
  await prisma.analyticsSummary.deleteMany();

  console.log('✅ Analytics data cleared!');
}

export async function seedAnalyticsData(
  prisma: PrismaClient,
  properties: Property[],
  options: { daysBack?: number; clearExisting?: boolean } = {}
) {
  const { daysBack = 30, clearExisting = false } = options;

  if (clearExisting) {
    await clearAnalyticsData(prisma);
  }

  // Generate listing views
  await generateListingViews(prisma, properties, daysBack);

  // Generate daily analytics summaries
  await generateDailyAnalytics(prisma, properties, daysBack);

  console.log('✅ Analytics data seeded successfully!');
}
