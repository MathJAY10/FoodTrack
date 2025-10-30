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
