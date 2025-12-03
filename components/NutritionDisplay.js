'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NutritionDisplay({ foodName, onClose }) {
  const [nutrition, setNutrition] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (foodName) {
      fetchNutrition()
    }
  }, [foodName])

  const fetchNutrition = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName }),
      })

      if (!response.ok) throw new Error('Failed to fetch nutrition')

      const data = await response.json()
      setNutrition(data.result.nutrition)
      setRecipe(data.result.recipe)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg text-gray-600">Loading nutrition info...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    )
  }

  if (!nutrition) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600 font-semibold">No nutrition data found</p>
      </div>
    )
  }

  const macroPercentages = {
    protein: (nutrition.protein * 4 / nutrition.calories * 100).toFixed(0),
    carbs: (nutrition.carbs * 4 / nutrition.calories * 100).toFixed(0),
    fat: (nutrition.fat * 9 / nutrition.calories * 100).toFixed(0),
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
        <h2 className="text-3xl font-bold mb-2">🍽️ {nutrition.foodName}</h2>
        <p className="text-green-100">Serving: {nutrition.servingSize}</p>
      </div>

      {/* Main Nutrition Card */}
      <div className="bg-white p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Macros */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Macronutrients</h3>
            
            <div className="space-y-4">
              {/* Calories */}
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-red-400 p-4 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm opacity-90">Calories</p>
                <p className="text-3xl font-bold">{nutrition.calories.toFixed(0)}</p>
                <p className="text-xs opacity-75">per serving</p>
              </motion.div>

              {/* Protein */}
              <motion.div
                className="bg-gradient-to-r from-red-400 to-pink-400 p-4 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm opacity-90">Protein</p>
                <p className="text-2xl font-bold">{nutrition.protein.toFixed(1)}g</p>
                <p className="text-xs opacity-75">{macroPercentages.protein}% of calories</p>
              </motion.div>

              {/* Carbs */}
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-cyan-400 p-4 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm opacity-90">Carbohydrates</p>
                <p className="text-2xl font-bold">{nutrition.carbs.toFixed(1)}g</p>
                <p className="text-xs opacity-75">{macroPercentages.carbs}% of calories</p>
              </motion.div>

              {/* Fat */}
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm opacity-90">Fat</p>
                <p className="text-2xl font-bold">{nutrition.fat.toFixed(1)}g</p>
                <p className="text-xs opacity-75">{macroPercentages.fat}% of calories</p>
              </motion.div>
            </div>
          </div>

          {/* Right - Micronutrients */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🥗 Micronutrients</h3>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>🔥 Fiber</span>
                <span className="font-bold">{nutrition.fiber.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>🍬 Sugar</span>
                <span className="font-bold">{nutrition.sugar.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>🧂 Sodium</span>
                <span className="font-bold">{nutrition.sodium.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>🏷️ Brand</span>
                <span className="font-bold text-sm">{nutrition.brands}</span>
              </div>
              {nutrition.barcode && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>📦 Barcode</span>
                  <span className="font-bold text-sm">{nutrition.barcode}</span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {nutrition.ingredients && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900 mb-2">📝 Ingredients:</p>
                <p className="text-sm text-blue-800">{nutrition.ingredients}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Suggestion */}
      {recipe && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">👨‍🍳 Recipe Suggestion</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full md:w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{recipe.title}</h4>
              <p className="text-gray-700 mb-3">
                ⏱️ {recipe.readyInMinutes} min | 👥 {recipe.servings} servings
              </p>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all font-semibold"
              >
                View Full Recipe →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-gray-100 p-4 rounded-b-lg flex gap-4">
        <button
          onClick={fetchNutrition}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all font-semibold"
        >
          🔄 Refresh
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-all font-semibold"
          >
            ✕ Close
          </button>
        )}
      </div>
    </motion.div>
  )
}
