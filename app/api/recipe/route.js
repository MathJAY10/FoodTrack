export async function POST(request) {
  try {
    const { foodName } = await request.json()
    if (!foodName) return Response.json({ error: "Food name required" }, { status: 400 })
    // TODO: Call Flask /recipe endpoint
    return Response.json({ ingredients: ["2 cups flour", "1 egg"], instructions: ["Mix", "Cook"] })
  } catch (error) {
    return Response.json({ error: "Failed to generate recipe" }, { status: 500 })
  }
}
