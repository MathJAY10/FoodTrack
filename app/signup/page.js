'use client'

import { signIn } from "next-auth/react"
import Link from "next/link"

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          🍎 Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign up to start tracking nutrition
        </p>
        
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          📧 Sign up with Google
        </button>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
