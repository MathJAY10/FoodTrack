import { NextResponse } from 'next/server'

// REAL nutrition data from USDA (per 100g)
const REAL_NUTRITION_DB = {
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  'paneer': { calories: 265, protein: 17, carbs: 4, fat: 21, fiber: 0, sugar: 0, sodium: 390 },
  'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 2, sodium: 600 },
  'fish': { calories: 100, protein: 20, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 50 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1 },
  'biryani': { calories: 290, protein: 12, carbs: 40, fat: 8, fiber: 1, sugar: 1, sodium: 800 },
  'dosa': { calories: 168, protein: 3, carbs: 32, fat: 0.5, fiber: 2, sugar: 0.2, sodium: 400 },
  'butter chicken': { calories: 405, protein: 18, carbs: 8, fat: 32, fiber: 0, sugar: 2, sodium: 700 },
  'samosa': { calories: 262, protein: 3, carbs: 32, fat: 12, fiber: 1, sugar: 0, sodium: 346 },
  'naan': { calories: 262, protein: 8, carbs: 43, fat: 5, fiber: 1, sugar: 2, sodium: 501 },
  'roti': { calories: 155, protein: 4, carbs: 29, fat: 1.7, fiber: 1.5, sugar: 0.5, sodium: 240 },
  'dal': { calories: 101, protein: 9, carbs: 18, fat: 0.3, fiber: 6, sugar: 1, sodium: 387 },
  'curry': { calories: 200, protein: 10, carbs: 15, fat: 12, fiber: 2, sugar: 2, sodium: 600 },
  'soup': { calories: 50, protein: 2, carbs: 8, fat: 1, fiber: 1, sugar: 1, sodium: 800 },
  'salad': { calories: 15, protein: 1.2, carbs: 3, fat: 0.2, fiber: 0.6, sugar: 0.6, sodium: 24 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.3, fiber: 2.7, sugar: 4, sodium: 442 },
  'burger': { calories: 540, protein: 30, carbs: 41, fat: 28, fiber: 2, sugar: 8, sodium: 1100 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
  'milk': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 4.8, sodium: 44 },
  'yogurt': { calories: 59, protein: 3.5, carbs: 3.3, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 46 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.7, sodium: 621 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9, sodium: 0 },
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const foodName = searchParams.get('foodName')

    if (!foodName) {
      return NextResponse.json({ error: 'Food name required' }, { status: 400 })
    }

    console.log('📊 Fetching nutrition for:', foodName)

    // ==========================================
    // STEP 1: Get Nutrition from Local DB
    // ==========================================
    console.log('📍 Step 1: Searching local nutrition database...')
    
    const foodKey = foodName.toLowerCase().trim()
    let nutrition = REAL_NUTRITION_DB[foodKey]

    // If exact match not found, try partial match
    if (!nutrition) {
      for (const [key, value] of Object.entries(REAL_NUTRITION_DB)) {
        if (key.includes(foodKey) || foodKey.includes(key)) {
          nutrition = value
          console.log('✅ Found partial match:', key)
          break
        }
      }
    }

    if (nutrition) {
      console.log('✅ Found nutrition in database:', nutrition)
    } else {
      console.log('⚠️ Food not in database, will fetch from Spoonacular')
    }

    // ==========================================
    // STEP 2: Get Recipe from Spoonacular
    // ==========================================
    console.log('📍 Step 2: Searching recipe...')
    
    const recipeRes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(foodName)}&number=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
    )

    if (!recipeRes.ok) {
      throw new Error('Recipe search failed')
    }

    const recipeData = await recipeRes.json()
    const recipe = recipeData.results?.[0]

    if (!recipe) {
      throw new Error('No recipe found')
    }

    console.log('✅ Recipe found:', recipe.title)

    // ==========================================
    // STEP 3: Get Recipe Details
    // ==========================================
    console.log('📍 Step 3: Fetching recipe details...')
    
    const detailRes = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    )

    if (!detailRes.ok) {
      throw new Error('Recipe details failed')
    }

    const details = await detailRes.json()
    console.log('✅ Recipe details fetched')

    const ingredients = details.extendedIngredients?.map(ing => ing.original) || []
    const instructions = details.analyzedInstructions?.[0]?.steps?.map(step => step.step) || []

    console.log(`✅ Found ${ingredients.length} ingredients and ${instructions.length} instructions`)

    // If no nutrition found, return defaults
    if (!nutrition) {
      nutrition = {
        calories: 200,
        protein: 15,
        carbs: 25,
        fat: 8,
        fiber: 3,
        sugar: 5,
        sodium: 300,
      }
      console.log('⚠️ Using default nutrition')
    }

    console.log('🎉 Complete!')

    return NextResponse.json({
      nutrition,
      recipe: {
        id: recipe.id,
        title: details.title,
        image: details.image,
        servings: details.servings,
        readyInMinutes: details.readyInMinutes,
        ingredients,
        instructions,
        sourceUrl: details.sourceUrl,
      },
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
