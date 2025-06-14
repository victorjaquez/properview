import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_AGENT_ID } from '@/lib/constants';

// Get single property by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// Update property by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (property.agentId !== MOCK_AGENT_ID) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this property' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Convert numeric fields
    const updates = { ...body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.bedrooms) updates.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms) updates.bathrooms = Number(updates.bathrooms);
    if (updates.sqft) updates.sqft = Number(updates.sqft);

    const updated = await prisma.property.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// Delete property by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (property.agentId !== MOCK_AGENT_ID) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this property' },
        { status: 403 }
      );
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Property deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
