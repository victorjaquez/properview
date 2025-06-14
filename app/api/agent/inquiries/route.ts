import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_AGENT_ID } from '@/lib/constants';

// Get inquiries for properties owned by the current agent
export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        property: true,
      },
      where: {
        property: {
          agentId: MOCK_AGENT_ID,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Failed to fetch agent inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
