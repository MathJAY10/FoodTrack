import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const foodId = searchParams.get('foodId')

    if (!foodId) {
      return NextResponse.json({ error: 'Food ID required' }, { status: 400 })
    }

    await prisma.foodLog.delete({ where: { id: foodId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
