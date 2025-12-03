'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function DailyStats({ userId, refreshTrigger }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchStats()
    }
  }, [userId, refreshTrigger])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/food/stats?userId=${userId}`)
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center text-gray-600">Loading...</p>
  if (!stats) return <p className="text-center text-gray-500">No data available</p>

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calories', value: stats.totalCalories.toFixed(0), icon: '🔥', color: 'from-orange-400 to-red-400' },
          { label: 'Protein', value: `${stats.totalProtein.toFixed(1)}g`, icon: '🥚', color: 'from-red-400 to-pink-400' },
          { label: 'Carbs', value: `${stats.totalCarbs.toFixed(1)}g`, icon: '��', color: 'from-blue-400 to-cyan-400' },
          { label: 'Fat', value: `${stats.totalFat.toFixed(1)}g`, icon: '🧈', color: 'from-yellow-400 to-orange-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-lg shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-3xl mb-2">{stat.icon}</p>
            <p className="text-sm opacity-90">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Foods Eaten Today */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">🍽️ Foods Eaten Today ({stats.foodCount})</h3>
        {stats.foods.length === 0 ? (
          <p className="text-gray-500">No foods logged today</p>
        ) : (
          <div className="space-y-2">
            {stats.foods.map((food) => (
              <motion.div 
                key={food.id} 
                className="flex justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-all"
                whileHover={{ x: 5 }}
              >
                <span className="font-semibold">{food.name}</span>
                <span className="text-gray-600 font-bold">{food.calories.toFixed(0)} cal</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
