export async function GET(request) {
  try {
    // TODO: Query Prisma FoodLog.findMany
    return Response.json([
      { id: "1", name: "Apple", imageUrl: "https://via.placeholder.com/300" },
      { id: "2", name: "Chicken", imageUrl: "https://via.placeholder.com/300" },
    ])
  } catch (error) {
    return Response.json({ error: "Failed to fetch foods" }, { status: 500 })
  }
}
