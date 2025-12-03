import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Food ID required' }, { status: 400 })
    }

    const food = await prisma.foodLog.findUnique({
      where: { id },
    })

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    return NextResponse.json({ food })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
