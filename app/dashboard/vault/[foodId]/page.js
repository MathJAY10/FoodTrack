'use client'

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
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
    <>
      <Navbar />
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
    </>
  )
}
