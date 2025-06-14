import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const MOCK_AGENT_ID = 'agent123';

// Get properties for specific agent
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { agentId: MOCK_AGENT_ID },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Failed to fetch agent properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent properties' },
      { status: 500 }
    );
  }
}
