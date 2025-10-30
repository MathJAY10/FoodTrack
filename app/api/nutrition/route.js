export async function POST(request) {
  try {
    const { foodName } = await request.json()
    if (!foodName) return Response.json({ error: "Food name required" }, { status: 400 })
    // TODO: Call Flask /nutrition endpoint
    return Response.json({ calories: 95, protein: 0.5, carbs: 25, fat: 0.3, vitamins: { vitaminC: 5.7 } })
  } catch (error) {
    return Response.json({ error: "Failed to fetch nutrition" }, { status: 500 })
  }
}
