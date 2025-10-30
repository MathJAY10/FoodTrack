'use client'

import Navbar from "../../components/Navbar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {session?.user?.name}! 👋
            </h1>
            <p className="text-gray-600 mb-6">
              Start tracking your nutrition with AI-powered food recognition.
            </p>
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Go to Dashboard →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
