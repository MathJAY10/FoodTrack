'use client'

import { useState } from "react"

export default function RecipeSection({ foodName }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateRecipe = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/recipe", { method: "POST", body: JSON.stringify({ foodName }) })
      const data = await res.json()
      setRecipe(data)
    } catch (error) {
      console.error("Error generating recipe:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🍳 Recipe</h2>
      {!recipe ? (
        <button onClick={generateRecipe} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
          <ul className="list-disc list-inside mb-6">
            {recipe.ingredients.map((ing, i) => (<li key={i} className="text-gray-700">{ing}</li>))}
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions.map((inst, i) => (<li key={i} className="text-gray-700">{inst}</li>))}
          </ol>
        </div>
      )}
    </div>
  )
}
