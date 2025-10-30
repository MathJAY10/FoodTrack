export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const foodId = searchParams.get("foodId")
    if (!foodId) return Response.json({ error: "Missing foodId" }, { status: 400 })
    // TODO: Query Prisma FoodItem with nutrition + recipe
    return Response.json({
      id: foodId,
      name: "Apple",
      imageUrl: "https://via.placeholder.com/300",
      nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, vitamins: { vitaminC: 5.7, vitaminA: 54 } },
      recipe: { ingredients: ["1 Apple"], instructions: "Wash and eat" },
      dailyCalories: 190,
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch details" }, { status: 500 })
  }
}
