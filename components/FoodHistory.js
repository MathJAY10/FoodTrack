'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function FoodHistory({ userId, refreshTrigger, onSelectFood }) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      fetchFoods()
    }
  }, [userId, refreshTrigger])

  const fetchFoods = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/food/list?userId=${userId}`)
      const data = await response.json()
      setFoods(data.foods || [])
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFood = async (foodId) => {
    if (!confirm('Delete this food?')) return
    try {
      await fetch(`/api/food/delete?foodId=${foodId}`, { method: 'DELETE' })
      setFoods(foods.filter(f => f.id !== foodId))
    } catch (error) {
      console.error('Error deleting food:', error)
    }
  }

  if (loading) return <p className="text-center text-gray-600">Loading...</p>

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">📋 Food History</h2>
      
      {foods.length === 0 ? (
        <p className="text-center text-gray-500">No foods logged yet</p>
      ) : (
        <div className="space-y-4">
          {foods.map((food, i) => (
            <motion.div
              key={food.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectFood && onSelectFood(food.name)}
            >
              {food.imageUrl && (
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{food.name}</h3>
                <p className="text-sm text-gray-600">
                  🔥 {food.calories.toFixed(0)} cal | 🥚 {food.protein.toFixed(1)}g protein | 🍞 {food.carbs.toFixed(1)}g carbs
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(food.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteFood(food.id)
                }}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all font-semibold"
              >
                🗑️ Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
