'use client'

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
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
    <>
      <Navbar />
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
    </>
  )
}
