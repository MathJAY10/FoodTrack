'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function RecipeDisplay({ foodName }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    if (foodName) {
      fetchRecipes()
    }
  }, [foodName])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName }),
      })

      if (!response.ok) throw new Error('Failed to fetch recipes')

      const data = await response.json()
      setRecipes(data.result.recipes || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center text-gray-600">Loading recipes...</p>
  }

  if (recipes.length === 0) {
    return <p className="text-center text-gray-500">No recipes found</p>
  }

  return (
    <div className="space-y-4">
      {/* Recipe List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedRecipe(recipe)}
            whileHover={{ y: -5 }}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                ⏱️ {recipe.readyInMinutes} min | 👥 {recipe.servings} servings
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all">
                View Recipe
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRecipe(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-lg max-w-2xl max-h-96 overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-bold mb-2">📊 Nutrition (per serving)</h3>
                <ul className="text-sm space-y-1">
                  <li>🔥 Calories: {selectedRecipe.nutrition.calories.toFixed(0)}</li>
                  <li>🥚 Protein: {selectedRecipe.nutrition.protein.toFixed(1)}g</li>
                  <li>🍞 Carbs: {selectedRecipe.nutrition.carbs.toFixed(1)}g</li>
                  <li>🧈 Fat: {selectedRecipe.nutrition.fat.toFixed(1)}g</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">🥘 Ingredients</h3>
                <ul className="text-sm space-y-1">
                  {selectedRecipe.ingredients.slice(0, 5).map((ing, i) => (
                    <li key={i}>• {ing.amount}</li>
                  ))}
                  {selectedRecipe.ingredients.length > 5 && (
                    <li>• +{selectedRecipe.ingredients.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>

            <a
              href={selectedRecipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all inline-block text-center"
            >
              View Full Recipe →
            </a>

            <button
              onClick={() => setSelectedRecipe(null)}
              className="mt-4 w-full bg-gray-300 text-gray-900 py-2 rounded hover:bg-gray-400 transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
