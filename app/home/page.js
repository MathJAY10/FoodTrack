'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">🍽️ FoodTracker</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700 font-semibold">{session?.user?.name}</span>
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {session?.user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start tracking your nutrition with AI-powered food recognition.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all text-lg">
                📊 Go to Dashboard
              </button>
            </Link>
            <Link href="/home">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all text-lg">
                📈 View Stats
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '📸', title: 'Upload Food', desc: 'Take a photo and AI will recognize it' },
            { icon: '📋', title: 'View History', desc: 'See all your logged meals' },
            { icon: '📊', title: 'Daily Stats', desc: 'Check your nutrition summary' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}