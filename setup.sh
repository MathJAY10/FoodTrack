#!/bin/bash

# Fill app/page.js
cat > app/page.js << 'FILE1'
import Link from "next/link"

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🍎 Food Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track your nutrition with AI-powered food recognition.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/api/auth/signin">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
              Login
            </button>
          </Link>
          <Link href="/api/auth/signin">
            <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
FILE1

# Fill app/home/page.js
cat > app/home/page.js << 'FILE2'
'use client'

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {session?.user?.name}! 👋
          </h1>
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
              Go to Dashboard →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
FILE2

# Fill app/dashboard/page.js
cat > app/dashboard/page.js << 'FILE3'
'use client'

import { useState, useEffect } from "react"
import UploadForm from "@/components/UploadForm"
import FoodCard from "@/components/FoodCard"
import ChatBot from "@/components/ChatBot"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchFoods()
    }
  }, [status])

  const fetchFoods = async () => {
    try {
      const res = await fetch("/api/food/list")
      const data = await res.json()
      setFoods(data)
    } catch (error) {
      console.error("Error fetching foods:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFoodAdded = () => {
    fetchFoods()
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Scan Food Image</h2>
          <UploadForm onFoodAdded={handleFoodAdded} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Dish Vault</h2>
          {foods.length === 0 ? (
            <p className="text-gray-600">No foods added yet. Upload an image to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </div>
      <ChatBot />
    </div>
  )
}
FILE3

# Fill app/dashboard/vault/[foodId]/page.js
cat > "app/dashboard/vault/[foodId]/page.js" << 'FILE4'
'use client'

import { useState, useEffect } from "react"
import NutritionPieChart from "@/components/NutritionPieChart"
import VitaminBarChart from "@/components/VitaminBarChart"
import RecipeSection from "@/components/RecipeSection"
import Link from "next/link"

export default function FoodDetails({ params }) {
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFoodDetails()
  }, [params.foodId])

  const fetchFoodDetails = async () => {
    try {
      const res = await fetch(`/api/food/details?foodId=${params.foodId}`)
      const data = await res.json()
      setFood(data)
    } catch (error) {
      console.error("Error fetching food details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!food) {
    return <div className="min-h-screen flex items-center justify-center">Food not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/dashboard">
          <button className="mb-6 text-green-600 hover:text-green-700 font-semibold">
            ← Back to Dashboard
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex gap-8 flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img src={food.imageUrl} alt={food.name} className="w-full rounded-lg object-cover" />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{food.name}</h1>
              <div className="bg-green-50 rounded-lg p-6 mb-4">
                <p className="text-gray-600">Daily Calories</p>
                <p className="text-3xl font-bold text-green-600">{food.dailyCalories} kcal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Macronutrients</h2>
            <NutritionPieChart data={food.nutrition} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vitamins & Minerals</h2>
            <VitaminBarChart data={food.nutrition.vitamins} />
          </div>
        </div>

        <RecipeSection foodName={food.name} />
      </div>
    </div>
  )
}
FILE4

echo "✓ Filled all page files"
