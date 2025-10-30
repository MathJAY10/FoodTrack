'use client'

import Navbar from "../components/Navbar"
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Landing() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🍎 Food Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your nutrition with AI-powered food recognition.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => signIn("google", { callbackUrl: "/home" })}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Sign In
            </button>
            <Link href="/signup">
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
