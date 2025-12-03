import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const foodId = searchParams.get('foodId');

    if (!foodId) {
      return NextResponse.json({ error: 'Missing foodId' }, { status: 400 });
    }

    const food = await prisma.foodLog.findUnique({
      where: { id: foodId },
    });

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json({ food });
  } catch (error) {
    console.error('Food details error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch food details' },
      { status: 500 }
    );
  }
}
