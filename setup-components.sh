#!/bin/bash

# Fill components/Navbar.jsx
cat > components/Navbar.jsx << 'NAVBAR'
'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          🍎 Food Tracker
        </Link>
        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <Link href="/api/auth/signin" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
NAVBAR

# Fill components/UploadForm.jsx
cat > components/UploadForm.jsx << 'UPLOADFORM'
'use client'

import { useState } from "react"

export default function UploadForm({ onFoodAdded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError("Please select a file"); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      const { imageUrl } = await uploadRes.json()

      const recognizeRes = await fetch("/api/recognize", { method: "POST", body: JSON.stringify({ imageUrl }) })
      const { foodName } = await recognizeRes.json()

      await fetch("/api/food/add", { method: "POST", body: JSON.stringify({ foodName, imageUrl, userId: "user-id" }) })

      setFile(null)
      onFoodAdded()
      alert(`Added ${foodName} to your vault!`)
    } catch (err) {
      setError("Failed to process image")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="file" accept="image/*" onChange={handleFileChange} className="border border-gray-300 rounded-lg p-3" />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
        {loading ? "Processing..." : "Upload & Recognize"}
      </button>
    </form>
  )
}
UPLOADFORM

# Fill components/FoodCard.jsx
cat > components/FoodCard.jsx << 'FOODCARD'
'use client'

import Link from "next/link"

export default function FoodCard({ food }) {
  return (
    <Link href={`/dashboard/vault/${food.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <img src={food.imageUrl} alt={food.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
          <p className="text-gray-600 text-sm">Click to view details</p>
        </div>
      </div>
    </Link>
  )
}
FOODCARD

# Fill components/NutritionPieChart.jsx
cat > components/NutritionPieChart.jsx << 'PIECHARTFILE'
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
PIECHARTFILE

# Fill components/VitaminBarChart.jsx
cat > components/VitaminBarChart.jsx << 'BARCHARTFILE'
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function VitaminBarChart({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({ name: key, value: value }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
BARCHARTFILE

# Fill components/RecipeSection.jsx
cat > components/RecipeSection.jsx << 'RECIPEFILE'
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
RECIPEFILE

# Fill components/ChatBot.jsx
cat > components/ChatBot.jsx << 'CHATBOTFILE'
'use client'

import { useState, useRef, useEffect } from "react"

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: input }) })
      const { response } = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      {!open ? (
        <button onClick={() => setOpen(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl">
          💬
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Food Tracker Bot</h3>
            <button onClick={() => setOpen(false)} className="text-xl hover:text-gray-200">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (<div className="flex justify-start"><div className="bg-gray-200 px-4 py-2 rounded-lg">Typing...</div></div>)}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1 border rounded-lg px-3 py-2 focus:outline-none" disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
CHATBOTFILE

echo "✓ Filled all component files"
