'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [stats, setStats] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats()
      fetchFoods()
    }
  }, [session?.user?.id])

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/food/stats?userId=${session?.user?.id}`)
      const data = await res.json()
      setStats(data.stats || {})
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchFoods = async () => {
    try {
      const res = await fetch(`/api/food/list?userId=${session?.user?.id}`)
      const data = await res.json()
      setFoods(data.foods || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching foods:', err)
      setLoading(false)
    }
  }

  const deleteFood = async (foodId) => {
    if (!confirm('Delete this food?')) return
    try {
      await fetch(`/api/food/delete?foodId=${foodId}`, { method: 'DELETE' })
      setFoods(foods.filter(f => f.id !== foodId))
      fetchStats()
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  const handleUploadFood = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadRes.ok) throw new Error('Upload failed')
      
      const uploadData = await uploadRes.json()
      const imageUrl = uploadData.url || uploadData.imageUrl

      const recognizeRes = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })
      
      if (!recognizeRes.ok) throw new Error('Recognition failed')
      
      const recognizeData = await recognizeRes.json()

      const addRes = await fetch('/api/food/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          foodName: recognizeData.result.food,
          imageUrl,
          calories: recognizeData.result.nutrition.calories,
          protein: recognizeData.result.nutrition.protein,
          carbs: recognizeData.result.nutrition.carbs,
          fat: recognizeData.result.nutrition.fat,
          fiber: recognizeData.result.nutrition.fiber,
          sugar: recognizeData.result.nutrition.sugar,
          sodium: recognizeData.result.nutrition.sodium,
        }),
      })

      if (addRes.ok) {
        setFile(null)
        setSelectedFood(recognizeData.result)
        fetchStats()
        fetchFoods()
        alert('✅ Food added successfully!')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return

    const newMessages = [...messages, { role: 'user', content: chatInput }]
    setMessages(newMessages)
    setChatInput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.result.message }])
    } catch (err) {
      console.error('Chat error:', err)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🍽️ Food Tracker</h1>
            <p className="text-green-100">Welcome, {session?.user?.name}!</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Dashboard', icon: '📊' },
            { id: 'upload', label: 'Upload Food', icon: '📸' },
            { id: 'vault', label: 'Food Vault', icon: '🏛️' },
            { id: 'nutrition', label: 'Nutrition', icon: '📈' },
            { id: 'chat', label: 'AI Chat', icon: '🤖' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:scale-105'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Calories', value: stats?.totalCalories?.toFixed(0) || '0', icon: '🔥', color: 'bg-orange-500' },
                { label: 'Protein', value: stats?.totalProtein?.toFixed(1) || '0', unit: 'g', icon: '🥚', color: 'bg-red-500' },
                { label: 'Carbs', value: stats?.totalCarbs?.toFixed(1) || '0', unit: 'g', icon: '🍞', color: 'bg-blue-500' },
                { label: 'Fat', value: stats?.totalFat?.toFixed(1) || '0', unit: 'g', icon: '🧈', color: 'bg-yellow-500' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} text-white p-6 rounded-lg shadow-lg transform transition hover:scale-105`}>
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}{stat.unit ? ` ${stat.unit}` : ''}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">📋 Recent Foods Today</h2>
              {foods.length === 0 ? (
                <p className="text-gray-600">No foods logged yet</p>
              ) : (
                <div className="space-y-4">
                  {foods.slice(0, 5).map((food) => (
                    <button
                      key={food.id}
                      onClick={() => router.push(`/food/${food.id}`)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-left transition"
                    >
                      {food.imageUrl && (
                        <img src={food.imageUrl} alt={food.name} className="w-12 h-12 rounded object-cover mr-4" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{food.name}</h3>
                        <p className="text-sm text-gray-600">🔥 {food.calories.toFixed(0)} cal | 🥚 {food.protein.toFixed(1)}g</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFood(food.id)
                        }}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold transition"
                      >
                        🗑️
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">📸 Upload Food Photo</h2>
            
            <form onSubmit={handleUploadFood} className="space-y-6">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  {file ? (
                    <div>
                      <p className="text-2xl mb-2">✅ {file.name}</p>
                      <p className="text-gray-600">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl mb-2">📷</p>
                      <p className="text-lg font-semibold text-gray-700">Click to upload or drag & drop</p>
                      <p className="text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {uploading ? '⏳ Processing...' : '🚀 Analyze Food'}
              </button>
            </form>

            {selectedFood && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">{selectedFood.food}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedFood.nutrition.calories.toFixed(0)}</p>
                  </div>
                  <div className="p-4 bg-white rounded">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-red-600">{selectedFood.nutrition.protein.toFixed(1)}g</p>
                  </div>
                  <div className="p-4 bg-white rounded">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedFood.nutrition.carbs.toFixed(1)}g</p>
                  </div>
                  <div className="p-4 bg-white rounded">
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedFood.nutrition.fat.toFixed(1)}g</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-6">🏛️ Food Vault</h2>
              {loading ? (
                <p>Loading...</p>
              ) : foods.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No foods in vault yet. Upload your first food!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {foods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => router.push(`/food/${food.id}`)}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {food.imageUrl ? (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-400">
                            <p className="text-4xl">🍽️</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-lg font-bold transition-opacity duration-300">View Details</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{food.name}</h3>
                        <p className="text-sm text-gray-600">🔥 {food.calories.toFixed(0)} cal</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(food.createdAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">📊 Daily Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-orange-600">Calories</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-orange-600 h-4 rounded-full" style={{width: `${Math.min(100, ((stats?.totalCalories || 0) / 2000) * 100)}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalCalories?.toFixed(0) || 0} / 2000</p>
                </div>

                <div>
                  <p className="font-semibold text-red-600">Protein</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-red-600 h-4 rounded-full" style={{width: `${Math.min(100, ((stats?.totalProtein || 0) / 150) * 100)}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalProtein?.toFixed(1) || 0} / 150g</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-600">Carbs</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-blue-600 h-4 rounded-full" style={{width: `${Math.min(100, ((stats?.totalCarbs || 0) / 300) * 100)}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalCarbs?.toFixed(1) || 0} / 300g</p>
                </div>

                <div>
                  <p className="font-semibold text-yellow-600">Fat</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div className="bg-yellow-600 h-4 rounded-full" style={{width: `${Math.min(100, ((stats?.totalFat || 0) / 65) * 100)}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalFat?.toFixed(1) || 0} / 65g</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">💡 Nutrition Tips</h2>
              <ul className="space-y-3 text-gray-700">
                <li>✅ Aim for 2000 calories daily</li>
                <li>✅ Get 150g of protein per day</li>
                <li>✅ Keep carbs around 300g</li>
                <li>✅ Limit fat to 65g daily</li>
                <li>✅ Drink plenty of water</li>
                <li>✅ Log meals regularly</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">🤖 AI Nutrition Assistant</h2>
            
            <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">Ask me anything about nutrition!</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about nutrition..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-600"
              />
              <button
                onClick={handleChat}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
