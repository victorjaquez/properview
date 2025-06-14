import { PrismaClient } from '@prisma/client';
import { agents, initialProperties, initialInquiries } from './seeds';
import { seedAnalyticsData } from './seedUtils';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.listingView.deleteMany();
  await prisma.propertyAnalytics.deleteMany();
  await prisma.analyticsSummary.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();

  console.log('Cleared existing data');

  // Create agents
  for (const agent of agents) {
    await prisma.agent.create({ data: agent });
  }
  console.log(`Created ${agents.length} agents`);

  // Create properties with diverse dates and statuses
  for (let i = 0; i < initialProperties.length; i++) {
    const property = initialProperties[i];

    // Create properties with varied listing dates (last 60 days)
    const randomDaysAgo = Math.floor(Math.random() * 60);
    const listingDate = new Date();
    listingDate.setDate(listingDate.getDate() - randomDaysAgo);

    // Some properties should be sold/pending with updated dates
    let status = property.status;
    let updatedAt = new Date();

    if (status === 'sold') {
      // Sold properties should have been updated within the last 30 days
      const soldDaysAgo = Math.floor(Math.random() * 30);
      updatedAt.setDate(updatedAt.getDate() - soldDaysAgo);
    } else if (status === 'pending') {
      // Pending properties should have been updated within the last 14 days
      const pendingDaysAgo = Math.floor(Math.random() * 14);
      updatedAt.setDate(updatedAt.getDate() - pendingDaysAgo);
    }

    await prisma.property.create({
      data: {
        ...property,
        status,
        dateListed: listingDate.toISOString().split('T')[0],
        createdAt: listingDate,
        updatedAt: status === 'active' ? listingDate : updatedAt,
      },
    });
  }
  console.log(`Created ${initialProperties.length} properties`);

  // Create inquiries (assign to random properties)
  const properties = await prisma.property.findMany();

  for (let i = 0; i < initialInquiries.length; i++) {
    const inquiry = initialInquiries[i];
    const randomProperty =
      properties[Math.floor(Math.random() * properties.length)];

    // Create inquiries with varied submission dates (last 30 days)
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const inquiryDate = new Date();
    inquiryDate.setDate(inquiryDate.getDate() - randomDaysAgo);

    // Add some random hours/minutes for better distribution
    inquiryDate.setHours(Math.floor(Math.random() * 24));
    inquiryDate.setMinutes(Math.floor(Math.random() * 60));

    await prisma.inquiry.create({
      data: {
        ...inquiry,
        propertyId: randomProperty.id,
        dateSubmitted: inquiryDate.toISOString(),
        createdAt: inquiryDate,
      },
    });
  }

  console.log(`Created ${initialInquiries.length} inquiries`);

  // Create analytics data using utility functions
  await seedAnalyticsData(prisma, properties, { daysBack: 30 });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('🚨 Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
