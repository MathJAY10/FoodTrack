export async function POST(request) {
  try {
    const { message, userId } = await request.json()
    if (!message) return Response.json({ error: "Message required" }, { status: 400 })
    // TODO: Call Flask /chat endpoint
    return Response.json({ response: "I'm here to help with nutrition!" })
  } catch (error) {
    return Response.json({ error: "Chat failed" }, { status: 500 })
  }
}
