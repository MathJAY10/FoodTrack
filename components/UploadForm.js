'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function UploadForm({ userId, onFoodAdded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !userId) return

    setLoading(true)
    setMessage('')

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      // 2. Recognize food from image
      const recognizeResponse = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      if (!recognizeResponse.ok) throw new Error('Recognition failed')

      const recognizeData = await recognizeResponse.json()
      const foodName = recognizeData.result.food
      const nutrition = recognizeData.result.nutrition

      // 3. Save to database
      const addResponse = await fetch('/api/food/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName,
          imageUrl,
          userId,
          ...nutrition,
        }),
      })

      if (!addResponse.ok) throw new Error('Save failed')

      setMessage('✅ Food added successfully!')
      setFile(null)
      setTimeout(() => {
        onFoodAdded?.()
      }, 1000)
    } catch (error) {
      setMessage(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-6">📸 Upload Food Photo</h2>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* File Input */}
        <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
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

        {/* Message */}
        {message && (
          <motion.p
            className={`text-center font-semibold ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!file || loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? '⏳ Processing...' : '🚀 Analyze Food'}
        </motion.button>
      </form>
    </motion.div>
  )
}
