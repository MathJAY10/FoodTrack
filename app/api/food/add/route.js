import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const {
      foodName,
      imageUrl,
      userId,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      servingSize,
      recipeTitle,
      recipeUrl,
    } = await request.json()

    if (!foodName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const food = await prisma.foodLog.create({
      data: {
        name: foodName,
        imageUrl: imageUrl || null,
        userId: userId,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        fiber: fiber || 0,
        sugar: sugar || 0,
        sodium: sodium || 0,
        servingSize: servingSize || '100g',
        recipeTitle: recipeTitle || null,
        recipeUrl: recipeUrl || null,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, food })
  } catch (error) {
    console.error('Add food error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add food' },
      { status: 500 }
    )
  }
}
