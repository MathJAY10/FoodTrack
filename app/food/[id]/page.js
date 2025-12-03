'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function FoodDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [food, setFood] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingRecipe, setGeneratingRecipe] = useState(false)
  const [showRecipe, setShowRecipe] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchFood()
    }
  }, [params.id])

  const fetchFood = async () => {
    try {
      const res = await fetch(`/api/food/${params.id}`)
      const data = await res.json()
      if (data.food) {
        setFood(data.food)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRecipe = async () => {
    if (!food?.name) return
    setGeneratingRecipe(true)
    try {
      const res = await fetch(`/api/recipe?foodName=${encodeURIComponent(food.name)}`)
      const data = await res.json()
      setRecipe(data.recipe)
      setShowRecipe(true)
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to generate recipe')
    } finally {
      setGeneratingRecipe(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading...</p></div>
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Food not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const nutritionData = [
    { name: 'Protein', value: parseFloat(food.protein || 0), color: '#ef4444' },
    { name: 'Carbs', value: parseFloat(food.carbs || 0), color: '#3b82f6' },
    { name: 'Fat', value: parseFloat(food.fat || 0), color: '#f59e0b' },
  ]

  const calorieBreakdown = [
    { name: 'Protein', calories: (parseFloat(food.protein || 0) * 4).toFixed(0), color: '#ef4444' },
    { name: 'Carbs', calories: (parseFloat(food.carbs || 0) * 4).toFixed(0), color: '#3b82f6' },
    { name: 'Fat', calories: (parseFloat(food.fat || 0) * 9).toFixed(0), color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative">
            {food.imageUrl ? (
              <div className="relative h-96 bg-gray-200">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="w-full p-8 text-white">
                    <h1 className="text-5xl font-bold mb-2">{food.name}</h1>
                    <p className="text-xl opacity-90">Added: {new Date(food.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-6xl mb-4">🍽️</p>
                  <h1 className="text-5xl font-bold">{food.name}</h1>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Calories', value: food.calories?.toFixed(0) || '0', icon: '🔥', color: 'bg-orange-500' },
            { label: 'Protein', value: food.protein?.toFixed(1) || '0', unit: 'g', icon: '🥚', color: 'bg-red-500' },
            { label: 'Carbs', value: food.carbs?.toFixed(1) || '0', unit: 'g', icon: '🍞', color: 'bg-blue-500' },
            { label: 'Fat', value: food.fat?.toFixed(1) || '0', unit: 'g', icon: '🧈', color: 'bg-yellow-500' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} text-white p-6 rounded-lg shadow-lg transform transition hover:scale-105`}>
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}{stat.unit ? ` ${stat.unit}` : ''}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">📊 Macro Breakdown (grams)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}g`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">🔥 Calorie Contribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calorieBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} kcal`} />
                <Bar dataKey="calories" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {calorieBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">📋 Detailed Nutrition (per 100g)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Calories', value: food.calories?.toFixed(0), unit: 'kcal', icon: '🔥' },
              { label: 'Protein', value: food.protein?.toFixed(1), unit: 'g', icon: '🥚' },
              { label: 'Carbs', value: food.carbs?.toFixed(1), unit: 'g', icon: '🍞' },
              { label: 'Fat', value: food.fat?.toFixed(1), unit: 'g', icon: '🧈' },
              { label: 'Fiber', value: food.fiber?.toFixed(1), unit: 'g', icon: '🌾' },
              { label: 'Sugar', value: food.sugar?.toFixed(1), unit: 'g', icon: '🍬' },
              { label: 'Sodium', value: food.sodium?.toFixed(0), unit: 'mg', icon: '🧂' },
              { label: 'Serving Size', value: food.servingSize || '100', unit: 'g', icon: '⚖️' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-l-4 border-green-600 shadow-md">
                <p className="text-sm text-gray-600 mb-1">{item.icon} {item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value} <span className="text-sm text-gray-500">{item.unit}</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">👨‍🍳 Recipe</h2>
            <button
              onClick={handleGenerateRecipe}
              disabled={generatingRecipe}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {generatingRecipe ? '⏳ Generating...' : '👀 Generate Recipe'}
            </button>
          </div>

          {showRecipe && (
            <>
              {recipe ? (
                <div className="space-y-6">
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-green-600">{recipe.title}</h3>
                    
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xl font-bold mb-3 text-gray-800">🥘 Ingredients:</h4>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex items-center p-2 bg-green-50 rounded hover:bg-green-100 transition">
                              <span className="text-xl mr-3 text-green-600">✓</span>
                              <span className="text-gray-700">{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {recipe.instructions && recipe.instructions.length > 0 && (
                      <div>
                        <h4 className="text-xl font-bold mb-3 text-gray-800">📖 Instructions:</h4>
                        <ol className="space-y-3">
                          {recipe.instructions.map((inst, i) => (
                            <li key={i} className="flex p-3 bg-blue-50 rounded hover:bg-blue-100 transition">
                              <span className="font-bold text-blue-600 mr-3 min-w-fit">Step {i + 1}:</span>
                              <span className="text-gray-700">{inst}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {recipe.servings && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                        <p className="text-sm text-gray-600">Servings: <span className="font-bold text-gray-900">{recipe.servings}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 py-8 text-center">No recipe available for this food</p>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition shadow-lg"
        >
          ← Go Back
        </button>
      </div>
    </div>
  )
}
