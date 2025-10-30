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
