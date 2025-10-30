import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Food Tracker',
  description: 'Track your nutrition with AI-powered food recognition',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
