import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const foodName = searchParams.get('foodName')

    console.log('🍳 Fetching recipe for:', foodName)

    if (!foodName) {
      return NextResponse.json({ recipe: null })
    }

    // Get recipe from Spoonacular with REAL nutrition
    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(foodName)}&number=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
    
    const searchRes = await fetch(searchUrl)

    if (!searchRes.ok) {
      throw new Error('Spoonacular search failed')
    }

    const searchData = await searchRes.json()
    const recipe = searchData.results?.[0]

    if (!recipe) {
      console.log('No recipe found')
      return NextResponse.json({ recipe: null })
    }

    console.log('📖 Found recipe:', recipe.title)

    // Get detailed recipe information
    const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    const detailRes = await fetch(detailUrl)

    if (!detailRes.ok) {
      throw new Error('Recipe details failed')
    }

    const details = await detailRes.json()

    console.log('✅ Recipe fetched with ingredients & instructions')

    return NextResponse.json({
      recipe: {
        title: details.title,
        image: details.image,
        servings: details.servings,
        prepTime: details.readyInMinutes,
        ingredients: details.extendedIngredients?.map(ing => `${ing.original}`) || [],
        instructions: details.analyzedInstructions?.[0]?.steps?.map(step => step.step) || [],
        sourceUrl: details.sourceUrl,
        nutrition: {
          calories: details.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
          protein: details.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
          carbs: details.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
          fat: details.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0,
        },
      },
    })
  } catch (error) {
    console.error('Recipe error:', error.message)
    return NextResponse.json({ recipe: null })
  }
}
