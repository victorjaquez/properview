import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;

    // Get total views for this property
    const totalViews = await prisma.listingView.count({
      where: { propertyId },
    });

    // Get total inquiries for this property
    const totalInquiries = await prisma.inquiry.count({
      where: { propertyId },
    });

    // Get unique visitors for this property
    const uniqueVisitors = await prisma.listingView
      .findMany({
        where: { propertyId },
        select: { sessionId: true },
        distinct: ['sessionId'],
      })
      .then((sessions) => sessions.length);

    return NextResponse.json({
      views: totalViews,
      inquiries: totalInquiries,
      uniqueVisitors,
    });
  } catch (error) {
    console.error('Failed to fetch property analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property analytics' },
      { status: 500 }
    );
  }
}
