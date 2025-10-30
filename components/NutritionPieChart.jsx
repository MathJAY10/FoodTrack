'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

export default function NutritionPieChart({ data }) {
  const chartData = [
    { name: "Protein", value: data.protein },
    { name: "Carbs", value: data.carbs },
    { name: "Fat", value: data.fat },
  ]
  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}g`} outerRadius={80} fill="#8884d8" dataKey="value">
          {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index]} />))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
