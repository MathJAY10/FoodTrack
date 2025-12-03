import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const foods = await prisma.foodLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysFoods = foods.filter(f => {
      const foodDate = new Date(f.createdAt)
      foodDate.setHours(0, 0, 0, 0)
      return foodDate.getTime() === today.getTime()
    })

    const stats = {
      totalCalories: todaysFoods.reduce((sum, f) => sum + (f.calories || 0), 0),
      totalProtein: todaysFoods.reduce((sum, f) => sum + (f.protein || 0), 0),
      totalCarbs: todaysFoods.reduce((sum, f) => sum + (f.carbs || 0), 0),
      totalFat: todaysFoods.reduce((sum, f) => sum + (f.fat || 0), 0),
      foodCount: todaysFoods.length,
      foods: todaysFoods,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
