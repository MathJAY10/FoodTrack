'use client'

import { motion } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-green-600">🍽️ FoodTracker</h1>
        {session ? (
          <Link href="/home" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Dashboard
          </Link>
        ) : null}
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-green-600">Eat Smart</span> with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              AI Food Tracker
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
            Track your meals with{' '}
            <span className="font-bold text-green-600">
              AI-powered food recognition
            </span>{' '}
            and get instant nutrition insights.
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn('google', { callbackUrl: '/home' })}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-green-700 transition-all text-lg"
            >
              🚀 Get Started with Google
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              {
                icon: '📸',
                title: 'Instant Recognition',
                desc: 'Snap a photo and AI identifies the food',
              },
              {
                icon: '📊',
                title: 'Nutrition Tracking',
                desc: 'Get complete nutritional breakdown',
              },
              {
                icon: '🤖',
                title: 'AI Assistant',
                desc: 'Get personalized health tips',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200"
                whileHover={{ y: -5 }}
              >
                <p className="text-5xl mb-3">{feature.icon}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-20 p-8 bg-white rounded-lg shadow-md border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">50K+</p>
                <p className="text-gray-600">Foods Tracked</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">10K+</p>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">98%</p>
                <p className="text-gray-600">Accurate</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-20">
        <p>© 2024 AI Food Tracker. All rights reserved.</p>
      </footer>
    </div>
  )
}
