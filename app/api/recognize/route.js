export async function POST(request) {
  try {
    const { imageUrl } = await request.json()
    if (!imageUrl) return Response.json({ error: "No image URL" }, { status: 400 })
    // TODO: Call Flask /predict endpoint
    return Response.json({ foodName: "Apple" })
  } catch (error) {
    return Response.json({ error: "Recognition failed" }, { status: 500 })
  }
}
