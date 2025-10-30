#!/bin/bash

# Fill app/api/auth/[...nextauth]/route.js
cat > "app/api/auth/[...nextauth]/route.js" << 'APIAUTH'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
APIAUTH

# Fill app/api/upload/route.js
cat > app/api/upload/route.js << 'APIUPLOAD'
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    if (!file) return Response.json({ error: "No file" }, { status: 400 })
    // TODO: Upload to Cloudinary/S3
    return Response.json({ imageUrl: "https://via.placeholder.com/300" })
  } catch (error) {
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}
APIUPLOAD

# Fill app/api/recognize/route.js
cat > app/api/recognize/route.js << 'APIRECOGNIZE'
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
APIRECOGNIZE

# Fill app/api/food/add/route.js
cat > app/api/food/add/route.js << 'APIFOODADD'
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
APIFOODADD

# Fill app/api/food/list/route.js
cat > app/api/food/list/route.js << 'APIFOODLIST'
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
APIFOODLIST

# Fill app/api/food/details/route.js
cat > app/api/food/details/route.js << 'APIFOODDETAILS'
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
APIFOODDETAILS

# Fill app/api/nutrition/route.js
cat > app/api/nutrition/route.js << 'APINUTRITION'
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
APINUTRITION

# Fill app/api/recipe/route.js
cat > app/api/recipe/route.js << 'APIRECIPE'
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
APIRECIPE

# Fill app/api/chat/route.js
cat > app/api/chat/route.js << 'APICHAT'
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
APICHAT

echo "✓ Filled all API route files"
