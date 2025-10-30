export async function POST(request) {
  try {
    const { foodName, imageUrl, userId } = await request.json()
    if (!foodName || !userId) return Response.json({ error: "Missing fields" }, { status: 400 })
    // TODO: Create FoodItem in Prisma
    return Response.json({ id: "food-123", name: foodName, imageUrl })
  } catch (error) {
    return Response.json({ error: "Failed to add food" }, { status: 500 })
  }
}
