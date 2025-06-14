import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_AGENT_ID } from '@/lib/constants';

// Fetch all active properties
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// Create new property
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received property data:', body);

    const {
      title,
      price,
      address,
      bedrooms,
      bathrooms,
      description,
      status,
      sqft,
      propertyType,
    } = body;

    // Check for missing required fields
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!price) missingFields.push('price');
    if (!address) missingFields.push('address');
    if (bedrooms === undefined || bedrooms === null)
      missingFields.push('bedrooms');
    if (bathrooms === undefined || bathrooms === null)
      missingFields.push('bathrooms');
    if (!description) missingFields.push('description');
    if (!status) missingFields.push('status');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create property with mock agent
    const property = await prisma.property.create({
      data: {
        agentId: MOCK_AGENT_ID,
        title,
        price: Number(price),
        address,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        description,
        status,
        sqft: sqft ? Number(sqft) : null,
        propertyType: propertyType || null,
        dateListed: new Date().toISOString().split('T')[0],
      },
    });

    console.log('Property created successfully:', property.id);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
