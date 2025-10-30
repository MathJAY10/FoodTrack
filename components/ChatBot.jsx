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
